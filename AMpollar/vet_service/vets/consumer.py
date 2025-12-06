from kafka import KafkaConsumer
import json, os
from .models import VetForm, Vet
import threading
from django.db import transaction

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

def listen_order_events():
    from .models import VetForm, Vet
    from django.db import transaction
    from kafka import KafkaConsumer
    import json, os, time

    KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
    time.sleep(2)
    print("Connecting to Kafka broker at:", KAFKA_BROKER)

    consumer = KafkaConsumer(
        "vetform_topic",
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="vet-form-service",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )

    print("Vet service listening for order events...")

    for message in consumer:
        print("Received message key:", message.key)
        data = message.value
        print("Received order event for VetForm:", data)
        try:
            with transaction.atomic():
                VetForm.objects.create(
                    vet_id=Vet.objects.get(id=data["vet_id"]),
                    owner_id=data["owner_id"],
                    pet_id=data["pet_id"],
                    purchase_id=data["purchase_id"],
                    status=data.get("status", "pending")
                )
                print(f"VetForm created for purchase_id: {data['purchase_id']}")
        except Exception as e:
            print(f"Failed to create VetForm: {e}")


def start_consumer_thread():
    thread = threading.Thread(target=listen_order_events, daemon=True)
    thread.start()
