# consumer.py
import json
import os
from kafka import KafkaConsumer
from gyro_process import process_gyro_data

# پیکربندی Kafka
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
topic = os.getenv("KAFKA_TOPIC", "gyro_events")  # topic شما

consumer = KafkaConsumer(
    topic,
    bootstrap_servers=KAFKA_BOOTSTRAP,
    group_id="gyro_group",
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print(f"[Consumer] Listening on topic: {topic}")

for msg in consumer:
    raw_msg = msg.value
    try:
        # payload یک رشته JSON هست → باید دیکشنری بشه
        payload_str = raw_msg.get("payload", "{}")
        payload = json.loads(payload_str)

        # پردازش با gyro_process
        result = process_gyro_data(payload)
        print(f"[Processed] Device: {raw_msg.get('device_ip')} → Payload: {payload} → Result: {result}", flush=True)

    except Exception as e:
        print("[Error] Processing message:", raw_msg, e, flush=True)









# import socket
# import threading
# import json
# import time
# import os
# from kafka import KafkaProducer
#
# # ---------------- Kafka Config ----------------
# KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
# KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "tcp.raw_events")
#
# producer = None
# try:
#     producer = KafkaProducer(
#         bootstrap_servers=KAFKA_BOOTSTRAP,
#         value_serializer=lambda v: json.dumps(v).encode("utf-8")
#     )
#     print(f"[Kafka] Connected to {KAFKA_BOOTSTRAP}")
# except Exception as e:
#     print("[Kafka] Connection error:", e)
#
# # ---------------- TCP Handler ----------------
# def handle_client(conn, addr):
#     print(f"[TCP] New device connected {addr}", flush=True)
#
#     while True:
#         try:
#             data = conn.recv(1024)
#             if not data:
#                 break
#
#             payload_str = data.decode().strip()
#             try:
#                 payload = json.loads(payload_str)
#             except json.JSONDecodeError:
#                 print("[TCP] Invalid JSON:", payload_str, flush=True)
#                 continue
#
#             # مطمئن شو فیلدهای مورد نظر هست
#             required_fields = ["ACCx", "ACCy", "ACCz", "Gx", "Gy", "Gz"]
#             if all(field in payload for field in required_fields):
#                 print(f"[TCP] Received valid gyro data: {payload}", flush=True)
#
#                 if producer:
#                     try:
#                         producer.send(KAFKA_TOPIC, payload)
#                         producer.flush()
#                         print("[Kafka] Event sent", flush=True)
#                     except Exception as e:
#                         print("[Kafka] Send error:", e, flush=True)
#             else:
#                 print("[TCP] Missing fields:", payload, flush=True)
#
#         except Exception as e:
#             print("[TCP] Connection error:", e, flush=True)
#             break
#
#     conn.close()
#     print(f"[TCP] Device disconnected {addr}", flush=True)
#
# # ---------------- TCP Server ----------------
# def start_server(port=9001):
#     s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#     s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
#     s.bind(("0.0.0.0", port))
#     s.listen()
#     print(f"[TCP] Listening on port {port}", flush=True)
#
#     while True:
#         conn, addr = s.accept()
#         threading.Thread(target=handle_client, args=(conn,), daemon=True).start()
#
#
#
# # ---------------- MAIN ----------------
# if __name__ == "__main__":
#     print("[INFO] Starting gyro TCP Server...", flush=True)
#     start_server(9001)
#
