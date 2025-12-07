from kafka import KafkaConsumer
import os, json, threading, requests
from django.db import transaction
from .models import Order
from .producer import send_order_event_to_vet

PET_SERVICE = "http://pet:8000"
THRESHOLD_SERVICE = "http://threshold:8000"
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

            owner_id = data["owner_id"]
            collar_id = data["collar_id"]
            vet_id = data["vet_id"]

            # -----------------------------------------------------
            # 1) Fetch owner pets
            # -----------------------------------------------------
            try:
                resp = requests.get(f"{PET_SERVICE}/pets/", params={"owner_id": owner_id}, timeout=5)
                resp.raise_for_status()
                pets = resp.json()
            except Exception as e:
                print(f"[OrderService] ERROR fetching pets → {e}")
                continue

            if not pets:
                print("[OrderService] Owner has no pets.")
                continue

            pet = next((p for p in pets if p.get("collar_id") in [0, None]), pets[-1])
            pet_id = pet["id"]

            # -----------------------------------------------------
            # 2) Update collar on selected pet
            # -----------------------------------------------------
            try:
                requests.patch(
                    f"{PET_SERVICE}/pets/{pet_id}/",
                    json={"collar_id": collar_id},
                    timeout=5
                )
            except Exception as e:
                print(f"[OrderService] ERROR updating pet → {e}")
                continue

            # -----------------------------------------------------
            # 3) Fetch full Pet Info
            # -----------------------------------------------------
            try:
                pet_detail = requests.get(f"{PET_SERVICE}/pets/{pet_id}/", timeout=5).json()
            except:
                pet_detail = {}

            # -----------------------------------------------------
            # 4) Fetch Threshold info for the collar
            # -----------------------------------------------------
            try:
                response = requests.get(
                    f"{THRESHOLD_SERVICE}/thresholds/",
                    params={"pet_id": pet_id},
                    timeout=5
                )
                response.raise_for_status()
                th_list = response.json()

                if isinstance(th_list, list) and len(th_list) > 0:
                    th = th_list[0]  # آخرین مقدار یا اولین؟ بستگی دارد
                else:
                    th = {}

            except Exception as e:
                print("[OrderService] ERROR fetching threshold →", e)
                th = {}

            # -----------------------------------------------------
            # 5) Create Order
            # -----------------------------------------------------
            try:
                with transaction.atomic():
                    order = Order.objects.create(
                        vet_id=vet_id,
                        owner_id=owner_id,
                        pet_id=pet_id,
                        collar_id=collar_id,
                        payment_id=data.get("payment_id"),
                        amount=data.get("amount", 0),
                        status="confirmed"
                    )
            except Exception as e:
                print(f"[OrderService] ERROR creating order → {e}")
                continue

            # -----------------------------------------------------
            # 6) Build FULL vet event
            # -----------------------------------------------------
            vet_event = {
                "vet_id": vet_id,
                "owner_id": owner_id,
                "pet_id": pet_id,
                "purchase_id": order.id,
                "status": "pending",

                # Pet Info
                "pet_name": pet_detail.get("name"),
                "pet_age": pet_detail.get("age"),
                "pet_race": pet_detail.get("race"),
                "pet_image": pet_detail.get("pet_image"),
                "pet_sex": pet_detail.get("sex"),
                "species": pet_detail.get("species"),

                # Threshold
                "body_temperature": th.get("body_temperature"),
                "hrv": th.get("hrv"),
            }

            # -----------------------------------------------------
            # 7) Send to Vet service
            # -----------------------------------------------------
            send_order_event_to_vet(vet_event)
            print("[OrderService] Vet event sent:", vet_event)

        except Exception as e:
            print(f"[OrderService] Unexpected error: {e}")


def start_consumer_thread():
    thread = threading.Thread(target=listen_payment_events, daemon=True)
    thread.start()
    print("[OrderService] Consumer thread started")
