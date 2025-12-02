# order/consumer.py
import os
import django
import json
import time
import signal
import sys
import logging
from kafka import KafkaConsumer, KafkaProducer
from kafka.errors import KafkaError, NoBrokersAvailable

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "order_service.settings")
django.setup()

from .models import Order

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
ORDER_TOPIC = "order_created"
VET_TOPIC = "vet_order_created"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)


class OrderConsumer:
    def __init__(self, topic=ORDER_TOPIC, group_id="order_group", retries=12, retry_delay=5):
        self.topic = topic
        self.group_id = group_id
        self.retries = retries
        self.retry_delay = retry_delay
        self.consumer = None
        self.producer = None
        self.running = True

        signal.signal(signal.SIGINT, self.stop)
        signal.signal(signal.SIGTERM, self.stop)

        self.connect_kafka()

    def stop(self, signum, frame):
        logging.info("⏹️ Stopping OrderConsumer...")
        self.running = False
        if self.consumer:
            self.consumer.close()
        if self.producer:
            self.producer.close()
        sys.exit(0)

    def connect_kafka(self):
        """اتصال به Kafka با retry"""
        for attempt in range(1, self.retries + 1):
            try:
                self.consumer = KafkaConsumer(
                    self.topic,
                    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                    auto_offset_reset="earliest",
                    group_id=self.group_id,
                    enable_auto_commit=True
                )
                self.producer = KafkaProducer(
                    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                    value_serializer=lambda v: json.dumps(v).encode("utf-8")
                )
                logging.info("✅ Kafka connected successfully")
                return
            except NoBrokersAvailable:
                logging.warning(f"⚠️ Kafka not available, retrying in {self.retry_delay}s ({attempt}/{self.retries})...")
                time.sleep(self.retry_delay)
        raise Exception("❌ Kafka not available after retries")

    def create_order(self, data: dict) -> Order | None:
        """ایجاد رکورد Order در دیتابیس"""
        payment_id = data.get("payment_id")
        if not payment_id:
            logging.error("❌ payment_id missing in message, skipping")
            return None

        if Order.objects.filter(payment_id=payment_id).exists():
            logging.warning(f"⚠️ Order with payment_id={payment_id} already exists → SKIPPED")
            return None

        try:
            order = Order.objects.create(
                user_id=data.get("user_id"),
                collar_id=data.get("collar_id"),
                payment_id=payment_id,
                amount=data.get("amount"),
                status="confirmed"
            )
            logging.info(f"✅ Order #{order.id} created")
            return order
        except Exception as e:
            logging.error(f"❌ Failed to create Order: {e}")
            return None

    def send_to_vet(self, order: Order):
        """ارسال پیام به سرویس Vet با retry"""
        payload = {
            "order_id": order.id,
            "user_id": order.user_id,
            "collar_id": order.collar_id
        }

        for attempt in range(1, 6):
            try:
                self.producer.send(VET_TOPIC, payload)
                self.producer.flush()
                logging.info(f"📤 vet_order_created sent (order_id={order.id})")
                return
            except KafkaError as e:
                logging.warning(f"⚠️ Failed sending to vet_order_created, retrying ({attempt}/5)... Error: {e}")
                time.sleep(2)
        logging.error(f"❌ Could not send message to vet_order_created after retries (order_id={order.id})")

    def run(self):
        """حلقه اصلی مصرف پیام‌ها با مدیریت خطا"""
        logging.info("🚀 Order Consumer Started")
        while self.running:
            try:
                for msg in self.consumer:
                    logging.info(f"📥 Raw message received: {msg}")
                    try:
                        data = msg.value
                        logging.info(f"📦 Parsed message: {data}")
                    except Exception as e:
                        logging.error(f"❌ Failed to parse message: {e}")
                        continue

                    order = self.create_order(data)
                    if order:
                        self.send_to_vet(order)
            except KafkaError as e:
                logging.error(f"⚠️ Kafka error: {e}, reconnecting...")
                self.connect_kafka()
            except Exception as e:
                logging.error(f"❌ Unexpected error: {e}, continuing...")
                time.sleep(1)


if __name__ == "__main__":
    consumer = OrderConsumer()
    consumer.run()
