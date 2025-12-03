from kafka import KafkaConsumer
import json, os
from .models import VetForm
import threading
from django.db import transaction

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

def listen_order_events():
    consumer = KafkaConsumer(
        "vetform_topic",
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        enable_auto_commit=False,
        group_id="vet-form-service",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    print("Vet service listening for order events...")
    for message in consumer:
        data = message.value
        print("Received order event for VetForm:", data)
        try:
            with transaction.atomic():
                VetForm.objects.create(
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
