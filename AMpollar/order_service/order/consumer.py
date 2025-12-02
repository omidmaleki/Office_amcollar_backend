# order/consumer.py
import os
import django
import json
import time
from kafka import KafkaConsumer, KafkaProducer
from kafka.errors import KafkaError

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "order_service.settings")
django.setup()

from .models import Order

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

print("🔄 Connecting to Kafka...")

# ====== ایجاد Kafka Consumer & Producer با Retry ======
for i in range(12):
    try:
        consumer = KafkaConsumer(
            "order_created",
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            auto_offset_reset="earliest",
            group_id="order_group",     # گروه پایدارتر برای پردازش
            enable_auto_commit=True
        )

        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )

        print("✅ Kafka connected successfully")
        break

    except Exception as e:
        print(f"⚠️ Kafka unavailable, retrying in 5 sec ({i+1}/12)...")
        time.sleep(5)
else:
    raise Exception("❌ Kafka not available after 12 retries")

print("🚀 Order Consumer Started")
print("-------------------------------------------")

# ======================================================
#   حلقه اصلی مصرف پیام‌ها
# ======================================================
for msg in consumer:
    print("📥 Raw message received:", msg)

    try:
        data = msg.value
        print("📦 Parsed message:", data)
    except Exception as e:
        print("❌ Failed to parse message:", e)
        continue

    # ===== جلوگیری از ایجاد رکورد تکراری =====
    if Order.objects.filter(payment_id=data["payment_id"]).exists():
        print(f"⚠️ Order with payment_id={data['payment_id']} already exists → SKIPPED")
        continue

    # ===== ایجاد Order =====
    try:
        order = Order.objects.create(
            user_id=data["user_id"],
            product_id=data["product_id"],
            payment_id=data["payment_id"],
            amount=data["amount"],
            status="confirmed"
        )
        print(f"✅ Order #{order.id} created")
    except Exception as e:
        print("❌ Failed to create Order:", e)
        continue

    # ===== ارسال پیام به سرویس Vet =====
    payload = {
        "order_id": order.id,
        "user_id": order.user_id,
        "product_id": order.product_id
    }

    for attempt in range(5):
        try:
            producer.send("vet_order_created", payload)
            producer.flush()
            print(f"📤 vet_order_created sent (order_id={order.id})")
            break
        except KafkaError as e:
            print(f"⚠️ Failed sending to vet_order_created, retrying ({attempt+1}/5)...")
            time.sleep(2)
    else:
        print("❌ Could not send message to vet_order_created after retries")

    print("-------------------------------------------")

