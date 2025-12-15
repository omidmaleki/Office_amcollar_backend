# consumer.py
import json
import os
from kafka import KafkaConsumer
from gyro_process import process_window


KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
topic = os.getenv("KAFKA_TOPIC", "gyro_events")  # topic شما

consumer = KafkaConsumer(
    topic,
    bootstrap_servers=KAFKA_BOOTSTRAP,
    group_id="gyro_group",
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print(f"[Consumer] Listening on topic: {topic}")

for msg in consumer:
    raw_msg = msg.value
    try:
        # payload یک رشته JSON هست → باید دیکشنری بشه
        payload_str = raw_msg.get("payload", "{}")
        payload = json.loads(payload_str)

        # پردازش با gyro_process
        result = process_window(payload)
        print(f"[Processed] Device: {raw_msg.get('device_ip')} → Payload: {payload} → Result: {result}", flush=True)

    except Exception as e:
        print("[Error] Processing message:", raw_msg, e, flush=True)



