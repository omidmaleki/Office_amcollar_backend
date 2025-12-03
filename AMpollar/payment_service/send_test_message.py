import os
import json
import time
from kafka import KafkaProducer
from kafka.errors import KafkaError

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

# ایجاد Producer با retry ساده
for i in range(12):
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        print("✅ Connected to Kafka")
        break
    except KafkaError:
        print(f"⚠️ Kafka not ready, retrying in 5s... ({i+1}/12)")
        time.sleep(5)
else:
    raise Exception("Kafka not available after multiple retries")

test_message = {
    "user_id": 999,
    "collar_id": 888,
    "payment_id": "test-payment-123",
    "amount": 123.45
}

# ارسال پیام با retry
for attempt in range(5):
    try:
        producer.send("payment_topic", test_message)
        producer.flush()  # flush روی خود producer
        print("✅ Test message sent to order_created topic")
        break
    except KafkaError as e:
        print(f"⚠️ Kafka send failed, retrying in 2s... ({attempt+1}/5)")
        time.sleep(2)
