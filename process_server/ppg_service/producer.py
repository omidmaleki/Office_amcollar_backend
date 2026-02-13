from kafka import KafkaProducer
import os, json
from datetime import datetime

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)


def send_ppg_to_vet(pet_id, hr, spo2, hrv, timestamp=None):
    if timestamp is None:
        timestamp = datetime.utcnow().isoformat()

    event = {
        "pet_id": pet_id,
        "hr": hr,
        "spo2": spo2,
        "hrv": hrv,
        "timestamp": timestamp
    }

    producer.send("ppg_topic", value=event)
    producer.flush()
    print(f"[PPG] Sent event to Vet: {event}")
