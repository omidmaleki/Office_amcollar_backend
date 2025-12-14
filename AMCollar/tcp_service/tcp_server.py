import socket
import threading
import json
import time
import os
import queue
from kafka import KafkaProducer

# ---------------------- CONFIG ----------------------
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")

# روی هر پورت چه تاپیکی ارسال شود؟
PORT_TOPIC_MAP = {
    9001: "gyro_events",
    9002: "ppg",
    9003: "gps"
}

# برای هر پورت یک صف داخلی
queues = {port: queue.Queue() for port in PORT_TOPIC_MAP}

BATCH_SIZE = 50  # تعداد پیام‌ها در هر batch

producer = None


# ---------------------- KAFKA INIT ----------------------
def init_kafka():
    global producer
    attempts = 20

    for i in range(attempts):
        try:
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP,
                value_serializer=lambda v: json.dumps(v).encode("utf-8")
            )
            print(f"[Kafka] Connected to {KAFKA_BOOTSTRAP}", flush=True)
            return
        except Exception as e:
            print(f"[Kafka] Connection failed ({i+1}/{attempts}). Retrying...", e, flush=True)
            time.sleep(2)

    print("[Kafka] ERROR: Could not connect to Kafka after retries!", flush=True)
    producer = None


# ---------------------- TCP CLIENT HANDLER ----------------------
def handle_client(conn, addr, port):
    """هر اتصال TCP را مدیریت می‌کند و پیام‌ها را وارد صف داخلی می‌کند."""
    print(f"[TCP] New device connected {addr} on port {port}", flush=True)

    while True:
        try:
            data = conn.recv(4096)
            if not data:
                break

            payload_str = data.decode().strip()
            if not payload_str:
                continue

            msg = {
                "device_ip": addr[0],
                "port": port,
                "payload": payload_str,
                "timestamp": int(time.time())
            }

            # 🔥 لاگ کامل TCP مانند نسخه قبلی
            print(f"[TCP] Received from port {port}: {msg}", flush=True)

            # ارسال پیام به صف مربوط به این پورت
            queues[port].put(msg)

        except Exception as e:
            print(f"[TCP] Connection error on port {port}: {e}", flush=True)
            break

    conn.close()
    print(f"[TCP] Device disconnected: {addr}", flush=True)


# ---------------------- KAFKA WORKER (BATCH SENDER) ----------------------
def kafka_worker(port):
    topic = PORT_TOPIC_MAP[port]
    batch = []
    last_send_time = time.time()

    print(f"[Worker] Kafka worker started for port {port}, topic '{topic}'", flush=True)

    while True:
        try:
            msg = queues[port].get(timeout=0.5)  # اگر نیم ثانیه پیام نیاد Timeout
            batch.append(msg)

        except queue.Empty:
            pass  # میریم سراغ چک‌کردن زمان

        # اگر batch پر شد → پیام‌ها را تک‌تک بفرست
        if len(batch) >= BATCH_SIZE:
            try:
                for item in batch:
                    # اضافه کردن کلید device_ip
                    producer.send(topic, key=item['device_ip'].encode('utf-8'), value=item)
                producer.flush()
                print(f"[Kafka] Sent {len(batch)} messages → topic: {topic}", flush=True)
            except Exception as e:
                print(f"[Kafka] ERROR sending batch: {e}", flush=True)

            batch.clear()
            last_send_time = time.time()

        # اگر نیم ثانیه گذشت و batch خالی نیست → فلش کن
        if batch and (time.time() - last_send_time > 0.5):
            try:
                for item in batch:
                    producer.send(topic, key=item['device_ip'].encode('utf-8'), value=item)
                producer.flush()
                print(f"[Kafka] Sent {len(batch)} messages (timeout flush) → topic: {topic}", flush=True)
            except Exception as e:
                print(f"[Kafka] ERROR sending on timeout: {e}", flush=True)

            batch.clear()
            last_send_time = time.time()



# ---------------------- TCP SERVER ----------------------
def start_port_listener(port):
    """Listener برای هر پورت TCP"""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(("0.0.0.0", port))
    server.listen()

    print(f"[TCP] Listening on port {port}", flush=True)

    while True:
        conn, addr = server.accept()
        threading.Thread(
            target=handle_client,
            args=(conn, addr, port),
            daemon=True
        ).start()


# ---------------------- MAIN ----------------------
if __name__ == "__main__":
    init_kafka()

    for p in PORT_TOPIC_MAP:
        threading.Thread(target=kafka_worker, args=(p,), daemon=True).start()

    for p in PORT_TOPIC_MAP:
        threading.Thread(target=start_port_listener, args=(p,), daemon=True).start()

    print("[TCP] All ports listening...", flush=True)

    while True:
        time.sleep(10)



































# import socket
# import threading
# import json
# import time
# import os
# from kafka import KafkaProducer
#
# KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
# producer = None
#
# # ----------------- PORT → TOPIC MAP -----------------
# PORT_TOPIC_MAP = {
#     9001: "gyro_events",
#     9002: "ppg",
#     9003: "raw_events"
# }
#
# # ----------------- INITIALIZE KAFKA -----------------
# def init_kafka():
#     global producer
#     attempts = 20
#
#     for i in range(attempts):
#         try:
#             producer = KafkaProducer(
#                 bootstrap_servers=KAFKA_BOOTSTRAP,
#                 value_serializer=lambda v: json.dumps(v).encode("utf-8")
#             )
#             print(f"[Kafka] Connected to {KAFKA_BOOTSTRAP}")
#             return
#         except Exception as e:
#             print(f"[Kafka] Connection failed ({i+1}/{attempts}). Retrying...", e, flush=True)
#             time.sleep(2)
#
#     print("[Kafka] ERROR: Could not connect to Kafka after retries!", flush=True)
#     producer = None
#
# # ----------------- TCP CLIENT HANDLER -----------------
# def handle_client(conn, addr, port):
#     print(f"[TCP] New device connected {addr} on port {port}", flush=True)
#     topic = PORT_TOPIC_MAP.get(port, "unknown_port_events")
#
#     while True:
#         try:
#             data = conn.recv(1024)
#             if not data:
#                 break
#
#             payload_str = data.decode().strip()
#             if not payload_str:
#                 # پیام خالی رد می‌کنیم
#                 continue
#
#             msg = {
#                 "device_ip": addr[0],
#                 "port": port,
#                 "payload": payload_str,
#                 "timestamp": int(time.time())
#             }
#
#             print(f"[TCP] Received from port {port}:", msg, flush=True)
#
#             # ارسال به Kafka
#             if producer:
#                 try:
#                     producer.send(topic, msg)
#                     producer.flush()
#                     print(f"[Kafka] Sent to topic '{topic}'", flush=True)
#                 except Exception as e:
#                     print("[Kafka] Send error:", e, flush=True)
#
#         except Exception as e:
#             print("[TCP] Connection error:", e, flush=True)
#             break
#
#     conn.close()
#     print("[TCP] Device disconnected:", addr, flush=True)
#
#
# # ----------------- START TCP SERVER -----------------
# def start_port_listener(port):
#     server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#     server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
#     server.bind(("0.0.0.0", port))
#     server.listen()
#
#     print(f"[TCP] Listening on port {port}", flush=True)
#
#     while True:
#         conn, addr = server.accept()
#         threading.Thread(target=handle_client, args=(conn, addr, port), daemon=True).start()
#
# # ----------------- MAIN -----------------
# if __name__ == "__main__":
#     init_kafka()
#
#     PORTS = [9001, 9002, 9003]
#     for p in PORTS:
#         threading.Thread(target=start_port_listener, args=(p,), daemon=True).start()
#
#     print("[TCP] All ports listening...", flush=True)
#
#     while True:
#         time.sleep(10)
