from kafka import KafkaConsumer
import os, json, threading
from django.db import transaction
from .models import VetForm, Vet

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")


def listen_order_events():
    consumer = KafkaConsumer(
        "vetform_topic",
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="vet-form-service",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )

    print("[VetService] Listening for VetForm events...")

    for message in consumer:
        data = message.value

        try:
            vet_instance = Vet.objects.get(id=data["vet_id"])
            pet_id = data.get("pet_id")
            if pet_id is None:
                print(f"[VetService] Skipping message because pet_id is None: {data}")
                continue

            with transaction.atomic():
                VetForm.objects.create(
                    vet=vet_instance,
                    owner_id=data["owner_id"],
                    pet_id=pet_id,
                    purchase_id=data["purchase_id"],
                    status=data.get("status", "pending"),

                    pet_name=data.get("pet_name"),
                    pet_age=data.get("pet_age"),
                    pet_race=data.get("pet_race"),
                    pet_image=data.get("pet_image"),

                    body_temperature=data.get("body_temperature"),
                    hrv=data.get("hrv"),
                )
                print(f"[VetService] VetForm created for purchase_id {data['purchase_id']}")

        except Exception as e:
            print(f"[VetService] ERROR creating VetForm: {e}")


def start_consumer_thread():
    thread = threading.Thread(target=listen_order_events, daemon=True)
    thread.start()
