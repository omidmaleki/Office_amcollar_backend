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

COLLAR_SERVICE_BY_MAC_URL = os.getenv(
    "COLLAR_SERVICE_BY_MAC_URL",
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
        payload_dict = json.loads(raw_msg.get("payload", "{}"))

        mac_address = payload_dict.get("mac_address")
        if not mac_address:
            raise ValueError("mac_address missing")

        timestamp_ms = payload_dict.get("timestamp")
        if not isinstance(timestamp_ms, int):
            raise ValueError("timestamp (ms) missing or invalid")

        # ------- فقط یک پیلود داریم -------
        payload_data = payload_dict.get("payload")
        if not isinstance(payload_data, dict):
            raise ValueError("payload must be a dict")
        data_window = [payload_data]  # wrap dict into list for process_window

        # -------- GET COLLAR INFO --------
        collar_resp = requests.get(f"{COLLAR_SERVICE_BY_MAC_URL}{mac_address}/")
        collar_resp.raise_for_status()
        collar_info = collar_resp.json()
        owner_id = collar_info.get("owner_id")  # owner_id stored as pet_id in collar
        collar_id = collar_info.get("id")
        if not owner_id or not collar_id:
            raise ValueError("COLLAR check failed, owner_id or collar_id missing")

        # -------- GET PET INFO USING OWNER ID --------
        pet_resp = requests.get(f"{VET_SERVICE_PET_URL}?owner_id={owner_id}")
        pet_resp.raise_for_status()

        pets = pet_resp.json()

        if not isinstance(pets, list) or len(pets) == 0:
            raise ValueError("No pet found for this owner")

        pet = pets[0]  # فرض: هر owner فقط یک pet فعال

        pet_id = pet.get("id")
        weight_kg = pet.get("weight_kg", 5)
        species = pet.get("species")

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