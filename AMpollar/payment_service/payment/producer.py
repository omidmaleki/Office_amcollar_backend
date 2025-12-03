from kafka import KafkaProducer
import json, os

# حتما نام broker را از environment بگیر
KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def send_payment_event(event_data):
    # Topic باید یکی باشد با consumer order_service
    producer.send("payment_topic", event_data)
    producer.flush()
    print(f"Sent payment event: {event_data}")
