import socket
import threading
import json
import time
import os
from kafka import KafkaProducer

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
producer = None

# ----------------- PORT → TOPIC MAP -----------------
PORT_TOPIC_MAP = {
    9001: "gyro_events",
    9002: "ppg",
    9003: "raw_events"
}

# ----------------- INITIALIZE KAFKA -----------------
def init_kafka():
    global producer
    attempts = 20

    for i in range(attempts):
        try:
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP,
                value_serializer=lambda v: json.dumps(v).encode("utf-8")
            )
            print(f"[Kafka] Connected to {KAFKA_BOOTSTRAP}")
            return
        except Exception as e:
            print(f"[Kafka] Connection failed ({i+1}/{attempts}). Retrying...", e, flush=True)
            time.sleep(2)

    print("[Kafka] ERROR: Could not connect to Kafka after retries!", flush=True)
    producer = None

# ----------------- TCP CLIENT HANDLER -----------------
def handle_client(conn, addr, port):
    print(f"[TCP] New device connected {addr} on port {port}", flush=True)
    topic = PORT_TOPIC_MAP.get(port, "unknown_port_events")

    while True:
        try:
            data = conn.recv(1024)
            if not data:
                break

            payload_str = data.decode().strip()
            if not payload_str:
                # پیام خالی رد می‌کنیم
                continue

            msg = {
                "device_ip": addr[0],
                "port": port,
                "payload": payload_str,
                "timestamp": int(time.time())
            }

            print(f"[TCP] Received from port {port}:", msg, flush=True)

            # ارسال به Kafka
            if producer:
                try:
                    producer.send(topic, msg)
                    producer.flush()
                    print(f"[Kafka] Sent to topic '{topic}'", flush=True)
                except Exception as e:
                    print("[Kafka] Send error:", e, flush=True)

        except Exception as e:
            print("[TCP] Connection error:", e, flush=True)
            break

    conn.close()
    print("[TCP] Device disconnected:", addr, flush=True)


# ----------------- START TCP SERVER -----------------
def start_port_listener(port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(("0.0.0.0", port))
    server.listen()

    print(f"[TCP] Listening on port {port}", flush=True)

    while True:
        conn, addr = server.accept()
        threading.Thread(target=handle_client, args=(conn, addr, port), daemon=True).start()

# ----------------- MAIN -----------------
if __name__ == "__main__":
    init_kafka()

    PORTS = [9001, 9002, 9003]
    for p in PORTS:
        threading.Thread(target=start_port_listener, args=(p,), daemon=True).start()

    print("[TCP] All ports listening...", flush=True)

    while True:
        time.sleep(10)
