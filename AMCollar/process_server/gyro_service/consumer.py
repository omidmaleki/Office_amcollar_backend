import json
import os
from kafka import KafkaConsumer
from gyro_process import process_window
from shared.device_context import resolve_device_context
import requests

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "gyro_events")

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
        payload_dict = json.loads(raw_msg.get("payload", "{}"))

        mac_address = payload_dict.get("mac_address")
        if not mac_address:
            raise ValueError("mac_address missing")

        timestamp_ms = payload_dict.get("timestamp")
        if not isinstance(timestamp_ms, int):
            raise ValueError("timestamp (ms) missing or invalid")

        payload_data = payload_dict.get("payload")
        if not isinstance(payload_data, dict):
            raise ValueError("payload must be a dict")

        data_window = [payload_data]

        # ✅ RESOLVE CONTEXT (shared logic)
        context = resolve_device_context(mac_address)

        pet_id = context["pet_id"]
        collar_id = context["collar_id"]
        species = context["species"]
        weight_kg = context["weight_kg"]

        # -------- PROCESS GYRO --------
        result = process_window(
            data_window,
            weight_kg=weight_kg,
            species_factor=1.0,
            breed_factor=1.0,
            window_seconds=5
        )

        # -------- SEND TO VET SERVICE --------
        request_payload = {
            "mac_address": mac_address,
            "collar_id": collar_id,
            "pet_id": pet_id,
            "species": species,
            "metrics": result,
            "timestamp": timestamp_ms,
        }

        response = requests.post(
            VET_SERVICE_INGEST_URL,
            json=request_payload,
            timeout=15
        )

        if response.status_code == 200:
            print(f"[OK] MAC {mac_address} sent to Threshold")
        else:
            print(f"[ERROR] Threshold response {response.status_code}: {response.text}")

    except Exception as e:
        print("[ERROR] Gyro consumer failed:", e, raw_msg, flush=True)
