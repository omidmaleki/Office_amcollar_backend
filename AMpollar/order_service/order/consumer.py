from kafka import KafkaConsumer
import os, json, threading, requests
from django.db import transaction
from .models import Order
from .producer import send_order_event_to_vet

PET_SERVICE = "http://pet:8000"
KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")


def listen_payment_events():
    consumer = KafkaConsumer(
        "payment_topic",
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    print("[OrderService] Listening for payment events...")

    for message in consumer:
        try:
            data = message.value
            print(f"[OrderService] Received payment event: {data}")

            # ---------- پیدا کردن pet_id ----------
            pet_id = None
            try:
                resp = requests.get(f"{PET_SERVICE}/pets/", params={"owner_id": data["owner_id"]}, timeout=5)
                resp.raise_for_status()
                pets = resp.json()
                print(f"[OrderService] Pets for owner {data['owner_id']}: {pets}")

                # فرض: هر pet یک collar_id دارد
                pet = next((p for p in pets if p.get("collar_id") == data["collar_id"]), None)
                if not pet:
                    print(f"[OrderService] No pet found for owner {data['owner_id']} with collar {data['collar_id']}")
                    continue
                pet_id = pet["id"]
                print(f"[OrderService] Selected pet_id: {pet_id}")
            except requests.exceptions.RequestException as e:
                print(f"[OrderService] Failed to fetch pets: {e}")
                continue
            except Exception as e:
                print(f"[OrderService] Unexpected error while fetching pets: {e}")
                continue

            # ---------- ایجاد رکورد Order ----------
            try:
                with transaction.atomic():
                    order = Order.objects.create(
                        vet_id=data["vet_id"],
                        owner_id=data["owner_id"],
                        collar_id=data["collar_id"],
                        pet_id=pet_id,
                        payment_id=data["payment_id"],
                        amount=data.get("amount", 0),
                        status="confirmed"
                    )
                print(f"[OrderService] Order created: {order.id}")
            except Exception as e:
                print(f"[OrderService] Failed to create Order: {e}")
                continue

            # ---------- ارسال event به Vet Service ----------
            try:
                vet_event = {
                    "vet_id": order.vet_id,
                    "owner_id": order.owner_id,
                    "pet_id": order.pet_id,
                    "purchase_id": order.id,
                    "status": "pending"
                }
                send_order_event_to_vet(vet_event)
                print(f"[OrderService] Sent vet event: {vet_event}")
            except Exception as e:
                print(f"[OrderService] Failed to send vet event: {e}")

        except Exception as e:
            print(f"[OrderService] Unexpected error: {e}")


def start_consumer_thread():
    thread = threading.Thread(target=listen_payment_events, daemon=True)
    thread.start()
    print("[OrderService] Consumer thread started")
