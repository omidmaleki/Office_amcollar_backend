from kafka import KafkaProducer
import json, os

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def send_order_event_to_vet(order_data):
    """
    ارسال پیام به vet_service
    """
    producer.send("vetform_topic", order_data)
    producer.flush()
    print(f"Sent order event to vet_service: {order_data}")
