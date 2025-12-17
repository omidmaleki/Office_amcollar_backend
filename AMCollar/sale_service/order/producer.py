# sale_service/order/producer.py

from kafka import KafkaProducer
import os, json

# آدرس Kafka Broker
KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

# ساخت Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def send_order_event_to_vet(order, pet_detail=None, threshold=None):
    if not order.pet_id:
        print(f"[SaleService] WARNING: order {order.id} has no pet_id, skipping sending to vet_service")
        return

    vet_event = {
        "vet_id": order.vet_id,
        "owner_id": order.owner_id,
        "pet_id": order.pet_id,
        "purchase_id": order.id,
        "status": order.status,
        "pet_name": pet_detail.get("name") if pet_detail else None,
        "pet_age": pet_detail.get("age") if pet_detail else None,
        "pet_race": pet_detail.get("race") if pet_detail else None,
        "pet_image": pet_detail.get("pet_image") if pet_detail else None,
        "pet_sex": pet_detail.get("sex") if pet_detail else None,
        "species": pet_detail.get("species") if pet_detail else None,
        "body_temperature": threshold.get("body_temperature") if threshold else None,
        "hrv": threshold.get("hrv") if threshold else None,
    }

    producer.send(
        "vetform_topic",
        key=str(order.id).encode("utf-8"),
        value=vet_event
    )
    producer.flush()
    print(f"[SaleService] Sent order event to vet_service: {vet_event}")
