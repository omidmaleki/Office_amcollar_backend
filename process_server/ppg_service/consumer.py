import json
import numpy as np
from kafka import KafkaConsumer
from datetime import datetime, timezone

from HR_process import compute_hr
from SPO2_process import compute_spo2
from shared.device_context import resolve_device_context
import requests
import os

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
KAFKA_TOPIC = "ppg"

VET_SERVICE_PPG_INGEST_URL = os.getenv(
    "VET_SERVICE_PPG_INGEST_URL",
    "http://vet:8000/threshold/ppg/ingest/"
)

FS = 150
SEND_COUNT = 10
HRV_COUNT = 3

ir_buffer = []
red_buffer = []
hr_list = []
EXPECTED_SAMPLES = None


def normalize_kafka_message(value):
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        return [value]
    raise ValueError("Invalid Kafka message format")


consumer = KafkaConsumer(
    KAFKA_TOPIC,
    bootstrap_servers=KAFKA_BOOTSTRAP,
    auto_offset_reset="latest",
    enable_auto_commit=True,
    group_id="ppg_group",
    value_deserializer=lambda v: json.loads(v.decode("utf-8"))
)

print("[PPG] Consumer started...")

for message in consumer:
    try:
        batch_msgs = normalize_kafka_message(message.value)

        for msg in batch_msgs:
            payload = json.loads(msg["payload"])

            mac_address = payload.get("mac_address")
            timestamp_ms = payload.get("timestamp")

            if not mac_address or not isinstance(timestamp_ms, int):
                raise ValueError("Invalid mac_address or timestamp")

            samples = payload.get("samples", {})
            ir_samples = samples.get("ir")
            red_samples = samples.get("red")

            if not ir_samples or not red_samples:
                raise ValueError("IR/RED samples missing")

            # ✅ resolve device context (shared)
            context = resolve_device_context(mac_address)
            pet_id = context["pet_id"]
            collar_id = context["collar_id"]

            timestamp_dt = datetime.fromtimestamp(
                timestamp_ms / 1000,
                tz=timezone.utc
            )

            if EXPECTED_SAMPLES is None:
                EXPECTED_SAMPLES = len(ir_samples)
                print(f"[PPG] Detected {EXPECTED_SAMPLES} samples")

            ir_buffer.extend(ir_samples)
            red_buffer.extend(red_samples)

        # ---------- PROCESS ----------
        if EXPECTED_SAMPLES and len(ir_buffer) >= SEND_COUNT * EXPECTED_SAMPLES:
            ir_array = np.array(ir_buffer, dtype=float)
            red_array = np.array(red_buffer, dtype=float)

            hr = compute_hr(ir_array, FS)
            spo2 = compute_spo2(ir_array, red_array)

            if hr:
                hr_list.append(hr)

            hrv = None
            if len(hr_list) >= HRV_COUNT:
                hrv = float(np.mean(hr_list))
                hr_list.clear()

            ir_buffer.clear()
            red_buffer.clear()

            # ---------- SEND TO VET ----------
            requests.post(
                VET_SERVICE_PPG_INGEST_URL,
                json={
                    "pet_id": pet_id,
                    "collar_id": collar_id,
                    "hr": hr,
                    "spo2": spo2,
                    "hrv": hrv,
                    "timestamp": int(timestamp_dt.timestamp() * 1000)
                },
                timeout=10
            )

            print(
                f"[PPG] sent → pet={pet_id} HR={hr} SPO2={spo2} HRV={hrv}"
            )

    except Exception as e:
        print("[PPG ERROR]", e, message.value, flush=True)
