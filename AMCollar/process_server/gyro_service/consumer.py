import json
import os
import requests
from kafka import KafkaConsumer
from gyro_process import process_window

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "gyro_events")

VET_SERVICE_INGEST_URL = os.getenv(
    "VET_SERVICE_INGEST_URL",
    "http://vet:8000/threshold/gyro/ingest/"
)

CLAR_SERVICE_BY_MAC_URL = os.getenv(
    "CLAR_SERVICE_BY_MAC_URL",
    "http://collar:8000/collars/by-mac/"
)

VET_SERVICE_PET_URL = os.getenv(
    "VET_SERVICE_PET_URL",
    "http://pet:8000/pets/"
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

        timestamp_ms = payload_dict.get("timestamp")
        if not isinstance(timestamp_ms, int):
            raise ValueError("timestamp (ms) missing or invalid")

        payload_data = payload_dict.get("payload")
        if not isinstance(payload_data, dict):
            raise ValueError("payload must be a dict")

        # -------- GET PET ID AND CLAR ID FROM CLAR --------
        clar_resp = requests.get(f"{CLAR_SERVICE_BY_MAC_URL}{mac_address}/")
        if clar_resp.status_code != 200:
            raise ValueError(f"CLAR service returned {clar_resp.status_code}")
        clar_info = clar_resp.json()
        pet_id = clar_info.get("pet_id")
        clar_id = clar_info.get("id")
        if not pet_id or not clar_id:
            raise ValueError("CLAR check failed, pet_id or clar_id missing")

        # -------- GET PET INFO FROM VET SERVICE USING CLAR ID --------
        pet_resp = requests.get(f"{VET_SERVICE_PET_URL}{clar_id}/")
        if pet_resp.status_code != 200:
            raise ValueError(f"Pet service returned {pet_resp.status_code}")
        pet_info = pet_resp.json()
        weight_kg = pet_info.get("weight_kg", 5)  # fallback 5kg

        # پردازش gyro با وزن واقعی پت
        result = process_window(
            [payload_data],
            weight_kg=weight_kg,
            window_seconds=5
        )

        request_payload = {
            "mac_address": mac_address,
            "metrics": result,
            "timestamp": timestamp_ms,
        }

        response = requests.post(
            VET_SERVICE_INGEST_URL,
            json=request_payload,
            timeout=3
        )

        if response.status_code == 200:
            print(f"[OK] MAC {mac_address} sent to Threshold")
        else:
            print(f"[ERROR] Threshold response {response.status_code}: {response.text}")

    except Exception as e:
        print("[ERROR] Gyro consumer failed:", e, raw_msg, flush=True)
