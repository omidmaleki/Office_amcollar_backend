from kafka import KafkaConsumer
import json, os, threading
from django.db import transaction
from .models import Threshold

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")


def listen_vetform_events():
    consumer = KafkaConsumer(
        "update_threshold_topic",
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        group_id="threshold-update-service",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )

    for message in consumer:
        data = message.value
        pet_id = data.get("pet_id")
        try:
            with transaction.atomic():
                threshold, _ = Threshold.objects.get_or_create(pet_id=pet_id)

                if data.get("body_temperature") is not None:
                    threshold.body_temperature = data["body_temperature"]
                if data.get("hrv") is not None:
                    threshold.hrv = data["hrv"]
                if data.get("heart_rate") is not None:
                    threshold.heart_rate = data["heart_rate"]

                threshold.save()
        except Exception as e:
            print(f"[ThresholdService] ERROR updating Threshold: {e}")


def start_consumer_thread():
    thread = threading.Thread(target=listen_vetform_events, daemon=True)
    thread.start()
    print("[ThresholdService] Consumer thread started")
