from kafka import KafkaConsumer
import os, json, threading

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

from .models import Order
from django.db import transaction  # برای atomic transaction
from .producer import send_order_event_to_vet
def listen_payment_events():
    consumer = KafkaConsumer(
        "payment_topic",
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    print("Order service listening for payment events...")
    for message in consumer:
        data = message.value
        print("Received payment event:", data)

        try:
            with transaction.atomic():
                order = Order.objects.create(
                    user_id=data["user_id"],
                    collar_id=data["collar_id"],
                    payment_id=data["payment_id"],
                    amount=data["amount"],
                    status="confirmed"
                )
                print(f"Order created for payment_id: {data['payment_id']}")

                # ارسال event به vet_service
                vet_event = {
                    "owner_id": order.user_id,
                    "pet_id": data.get("collar_id"),  # فرض کردیم pet_id = collar_id
                    "purchase_id": order.id,
                    "status": "pending"
                }
                send_order_event_to_vet(vet_event)

        except Exception as e:
            print(f"Failed to create order: {e}")


def start_consumer_thread():
    thread = threading.Thread(target=listen_payment_events, daemon=True)
    thread.start()
