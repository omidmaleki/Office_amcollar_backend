from kafka import KafkaConsumer
import os, json, threading
from django.db import transaction
from .models import VetForm, Vet
import logging  # برای logger بهتر

logger = logging.getLogger(__name__)

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

    logger.info("[VetService] Listening for VetForm events...")

    for message in consumer:
        data = message.value

        # فیکس اصلی: فقط ORDER_CREATED رو process کن (SMS رو skip)
        if data.get("event_type") != "ORDER_CREATED":
            logger.debug(f"[VetService] Skipping non-vet event: {data.get('event_type', 'unknown')} for order_id {data.get('order_id', 'N/A')}")
            continue

        try:
            vet_instance = Vet.objects.get(id=data["vet_id"])
            pet_id = data.get("pet_id")
            if pet_id is None:
                logger.warning(f"[VetService] Skipping message because pet_id is None: {data}")
                continue

            with transaction.atomic():
                VetForm.objects.create(
                    vet=vet_instance,
                    owner_id=data["owner_id"],
                    pet_id=pet_id,
                    purchase_id=data.get("purchase_id") or data.get("order_id"),
                    status=data.get("status", "pending"),

                    pet_name=data.get("pet", {}).get("name"),  # از pet dict بگیر (از producer)
                    pet_age=data.get("pet", {}).get("age"),
                    pet_race=data.get("pet", {}).get("race"),
                    pet_image=data.get("pet", {}).get("image"),

                    body_temperature=data.get("threshold", {}).get("body_temperature"),
                    hrv=data.get("threshold", {}).get("hrv"),
                )
                logger.info(f"[VetService] VetForm created for purchase_id {data.get('purchase_id', 'N/A')}")

        except Vet.DoesNotExist:
            logger.error(f"[VetService] Vet with id {data['vet_id']} not found")
        except Exception as e:
            logger.error(f"[VetService] ERROR creating VetForm for order_id {data.get('order_id', 'N/A')}: {e}")

def start_consumer_thread():
    thread = threading.Thread(target=listen_order_events, daemon=True)
    thread.start()