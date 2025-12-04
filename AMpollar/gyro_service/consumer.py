import json
import os
from kafka import KafkaConsumer

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
topic = os.getenv("KAFKA_TOPIC", "gyro_events")

consumer = KafkaConsumer(
    topic,
    bootstrap_servers=KAFKA_BOOTSTRAP,
    group_id="gyro_group",
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print(f"[Consumer] Listening on topic: {topic}")

for msg in consumer:
    print("[Consumer] Got:", msg.value, flush=True)