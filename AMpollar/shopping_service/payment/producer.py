from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda val: json.dumps(val).encode('utf-8')
)

def publish_order_event(event_data):
    producer.send("order_created", event_data)
    producer.flush()
