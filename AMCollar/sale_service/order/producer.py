from kafka import KafkaProducer
import os
import json
import logging
import requests  # برای API call به Owner service

logger = logging.getLogger(__name__)

# آدرس Kafka Broker
KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

# آدرس Owner Service (برای fetch موبایل)
OWNER_SERVICE = "http://owner:8000"  # اگر متغیر محیطی دارید، از os.getenv استفاده کنید

# ساخت Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def send_order_event_to_vet(order, pet_detail=None, threshold=None):
    """
    ارسال eventهای Vet و SMS برای order ایجاد شده.
    - Vet event همیشه ارسال می‌شود (اگر pet_id وجود داشته باشد).
    - SMS event فقط اگر موبایل owner در دسترس باشد ارسال می‌شود.
    """
    try:
        # چک اولیه pet_id
        if not order.pet_id:
            logger.warning(
                "[OrderService] order %s has no pet_id, skipping events",
                order.id
            )
            return

        # base_event
        base_event = {
            "event_type": "ORDER_CREATED",
            "event_version": 1,
            "order_id": order.id,
            "status": order.status,
            "vet_id": order.vet_id,
            "owner_id": order.owner_id,  # از owner_id استفاده می‌کنیم (نه owner ForeignKey)
            "pet_id": order.pet_id,
            "purchase_id": getattr(order, 'purchase_id', None),  # فرض: اگر order.purchase_id داری، اضافه کن
        }

        # ---------- Vet Event ----------
        vet_event = {
            **base_event,
            "pet": {
                "name": pet_detail.get("name") if pet_detail else None,
                "age": pet_detail.get("age") if pet_detail else None,
                "race": pet_detail.get("race") if pet_detail else None,
                "image": pet_detail.get("pet_image") if pet_detail else None,
                "sex": pet_detail.get("sex") if pet_detail else None,
                "species": pet_detail.get("species") if pet_detail else None,
            },
            "threshold": {
                "body_temperature": threshold.get("body_temperature") if threshold else None,
                "hrv": threshold.get("hrv") if threshold else None,
            },
        }

        # ارسال Vet Event
        try:
            producer.send(
                topic="vetform_topic",
                key=str(order.id).encode("utf-8"),
                value=vet_event,
            )
            logger.debug("[OrderService] Vet event sent for order_id=%s", order.id)
        except Exception as e:
            logger.error("[OrderService] Failed to send vet event for order_id=%s: %s", order.id, str(e))
            # ادامه می‌دیم، چون SMS جداگانه است

        # ---------- SMS Event ----------
        mobile = None
        try:
            # Fetch موبایل از Owner service
            r_owner = requests.get(
                f"{OWNER_SERVICE}/owners/{order.owner_id}/",
                timeout=5,  # timeout کوتاه برای جلوگیری از بلوک
                headers={"Content-Type": "application/json"}  # اگر لازم باشه
            )
            r_owner.raise_for_status()
            owner_data = r_owner.json()
            if owner_data:  # چک اگر response خالی نباشه
                mobile = owner_data.get("phone") or owner_data.get("mobile")  # اول phone، fallback به mobile
                logger.debug("[OrderService] Fetched owner %s: mobile=%s", order.owner_id, mobile)
            else:
                logger.warning("[OrderService] Empty response from owner service for owner_id=%s", order.owner_id)
        except requests.RequestException as e:
            logger.error("[OrderService] Failed to fetch owner %s: %s", order.owner_id, str(e))
            mobile = None
        except Exception as e:
            logger.error("[OrderService] Unexpected error fetching owner %s: %s", order.owner_id, str(e))
            mobile = None

        # ارسال SMS فقط اگر موبایل موجود باشد
        if mobile:
            sms_event = {
                "event_type": "SEND_SMS",
                "event_version": 1,
                "order_id": order.id,
                "mobile": mobile,
                "template": "ORDER_CREATED",
                "params": {
                    "order_id": order.id,
                    "pet_name": pet_detail.get("name") if pet_detail else "",
                },
                "purchase_id": getattr(order, 'purchase_id', None),  # اضافه: برای compatibility با consumer (اگر لازم)
            }

            try:
                producer.send(
                    topic="vetform_topic",  # همون topic، اما key متفاوت
                    key=f"sms-{order.id}".encode("utf-8"),
                    value=sms_event,
                )
                logger.debug("[OrderService] SMS event sent for order_id=%s", order.id)
            except Exception as e:
                logger.error("[OrderService] Failed to send SMS event for order_id=%s: %s", order.id, str(e))
        else:
            logger.info("[OrderService] Skipping SMS for order_id=%s (no mobile)", order.id)

        # Flush producer برای اطمینان از ارسال
        try:
            producer.flush(timeout=10)  # ۱۰ ثانیه timeout، غیربلوکی
            logger.debug("[OrderService] Producer flushed for order_id=%s", order.id)
        except Exception as e:
            logger.warning("[OrderService] Producer flush failed for order_id=%s: %s", order.id, str(e))

        # Log نهایی
        logger.info(
            "[OrderService] Events processed for order_id=%s (vet: yes, sms: %s)",
            order.id,
            "yes" if mobile else "no"
        )

    except Exception as e:
        # Try-except کلی برای کل تابع (fallback)
        logger.error("[OrderService] Unexpected error in send_order_event_to_vet for order_id=%s: %s", order.id, str(e))
        # هیچ raise نمی‌کنیم تا caller crash نکند