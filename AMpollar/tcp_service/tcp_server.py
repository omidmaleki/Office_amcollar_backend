import socket
import threading
import json
import time
import os
from kafka import KafkaProducer

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
producer = None

# ----------------- INITIALIZE KAFKA -----------------
def init_kafka():
    global producer
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP,
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        print(f"Connected to Kafka at {KAFKA_BOOTSTRAP}")
    except Exception as e:
        print("Kafka connection error:", e)
        producer = None

# ----------------- TCP CLIENT HANDLER -----------------
def handle_client(conn, addr, port):
    print(f"New device connected {addr} on port {port}", flush=True)

    while True:
        try:
            data = conn.recv(1024)
            if not data:
                break

            payload = data.decode().strip()

            msg = {
                "device_ip": addr[0],
                "port": port,
                "payload": payload,
                "timestamp": int(time.time())
            }

            print("Received:", msg, flush=True)

            if producer:
                try:
                    producer.send("tcp.raw_events", msg)
                    producer.flush()
                    print("Kafka event sent.", flush=True)
                except Exception as e:
                    print("Kafka send error:", e, flush=True)

        except Exception as e:
            print("Connection error:", e, flush=True)
            break

    conn.close()
    print("Device disconnected:", addr, flush=True)

# ----------------- START PORT LISTENER -----------------
def start_port_listener(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    s.bind(("0.0.0.0", port))
    s.listen()

    print(f"TCP Server listening on port {port}", flush=True)

    while True:
        conn, addr = s.accept()
        threading.Thread(target=handle_client, args=(conn, addr, port), daemon=True).start()

# ----------------- MAIN -----------------
if __name__ == "__main__":
    init_kafka()

    PORTS = [9001, 9002, 9003]

    for p in PORTS:
        threading.Thread(target=start_port_listener, args=(p,), daemon=True).start()

    print("All TCP ports are listening...", flush=True)
    while True:
        time.sleep(10)
