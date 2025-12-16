from kafka import KafkaProducer
import json, os

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")


import os

if not os.getenv("DISABLE_KAFKA", "False") == "True":
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BROKER,
        value_serializer=lambda v: json.dumps(v).encode("utf-8")
    )
else:
    producer = None


def send_threshold_update_event(vetform):
    """
    vetform: instance of VetForm
    """
    if vetform.status != "completed":
        return

    event = {
        "pet_id": vetform.pet_id,
        "body_temperature": vetform.body_temperature,
        "hrv": vetform.hrv
        # "heart_rate": getattr(vetform, "pet_heart_rate", None)  # فقط اگر داری
    }
    producer.send("update_threshold_topic", event)
    producer.flush()



