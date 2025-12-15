import json
import os
import requests
from kafka import KafkaConsumer
from gyro_process import process_window


KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "gyro_events")

# Vet + Threshold یکی هستن
VET_SERVICE_INGEST_URL = os.getenv(
    "VET_SERVICE_INGEST_URL",
    "http://vet:8000/threshold/gyro/ingest/"
)

consumer = KafkaConsumer(
    KAFKA_TOPIC,
    bootstrap_servers=KAFKA_BOOTSTRAP,
    group_id="gyro_group",
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
)

print(f"[Gyro Consumer] Listening on topic: {KAFKA_TOPIC}")

for msg in consumer:
    raw_msg = msg.value
    try:
        payload_str = raw_msg.get("payload", "{}")
        payload_dict = json.loads(payload_str)

        mac_address = payload_dict.get("mac_address")
        if not mac_address:
            raise ValueError("mac_address missing")

        payload_data = payload_dict.get("payload")  # dict
        if not isinstance(payload_data, dict):
            raise ValueError("payload must be a dict")

        # process_window expects a list of dicts
        result = process_window(
            [payload_data],
            weight_kg=70,
            height_m=1.75,
            window_seconds=60
        )

        request_payload = {
            "mac_address": mac_address,
            "metrics": result,
            "timestamp": msg.timestamp,
        }

        response = requests.post(VET_SERVICE_INGEST_URL, json=request_payload, timeout=3)

        if response.status_code == 200:
            print(f"[OK] MAC {mac_address} sent to Threshold")
        else:
            print(f"[ERROR] Threshold response {response.status_code}: {response.text}")

    except Exception as e:
        print("[ERROR] Gyro consumer failed:", e, raw_msg, flush=True)

