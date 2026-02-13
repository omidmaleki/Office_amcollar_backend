from kafka import KafkaProducer
import os
import json
import logging
import requests  # برای API call به Owner و Vet service

logger = logging.getLogger(__name__)

# آدرس Kafka Broker
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

# آدرس Owner و Vet Service
OWNER_SERVICE = "http://owner:8000"
VET_SERVICE = "http://vet:8000"

# ساخت Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def send_order_event_to_vet(order, pet_detail=None, threshold=None):
    """
    ارسال eventهای Vet و SMS برای order ایجاد شده.
    - Vet event همیشه ارسال می‌شود (اگر pet_id وجود داشته باشد).
    - SMS event فقط اگر موبایل owner/vet/support در دسترس باشد ارسال می‌شود.
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
            "owner_id": order.owner_id,
            "pet_id": order.pet_id,
            "purchase_id": getattr(order, 'purchase_id', None),
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

        # ---------- SMS Events ----------
        # SMS برای Owner
        mobile_owner = None
        owner_name = None  # fetch از owner (برای استفاده در vet/support)
        try:
            r_owner = requests.get(
                f"{OWNER_SERVICE}/owners/{order.owner_id}/",
                timeout=5,
                headers={"Content-Type": "application/json"}
            )
            r_owner.raise_for_status()
            owner_data = r_owner.json()
            if owner_data:
                mobile_owner = owner_data.get("phone") or owner_data.get("mobile")
                owner_name = owner_data.get("name", "مشتری")  # نام owner رو بگیر
                logger.debug("[OrderService] Fetched owner %s: mobile=%s, name=%s", order.owner_id, mobile_owner, owner_name)
        except Exception as e:
            logger.error("[OrderService] Failed to fetch owner %s: %s", order.owner_id, str(e))

        if mobile_owner:
            sms_owner_event = {
                "event_type": "SEND_SMS",
                "event_version": 1,
                "order_id": order.id,
                "mobile": mobile_owner,
                "template": "ORDER_CREATED",  # برای owner
                "params": {
                    "order_id": order.id,
                    "pet_name": pet_detail.get("name") if pet_detail else "",
                },
                "purchase_id": base_event["purchase_id"],
            }
            try:
                producer.send(
                    topic="vetform_topic",
                    key=f"owner-sms-{order.id}".encode("utf-8"),  # key متفاوت برای owner
                    value=sms_owner_event,
                )
                logger.debug("[OrderService] Owner SMS event sent for order_id=%s", order.id)
            except Exception as e:
                logger.error("[OrderService] Failed to send owner SMS for order_id=%s: %s", order.id, str(e))

        # SMS برای Vet
        mobile_vet = None
        try:
            r_vet = requests.get(
                f"{VET_SERVICE}/vets/{order.vet_id}/",  # فرض endpoint vets/{id}/ با فیلد phone
                timeout=5,
                headers={"Content-Type": "application/json"}
            )
            r_vet.raise_for_status()
            vet_data = r_vet.json()
            if vet_data:
                mobile_vet = vet_data.get("phone") or vet_data.get("mobile")  # فرض فیلد phone در vet model
                logger.debug("[OrderService] Fetched vet %s: mobile=%s", order.vet_id, mobile_vet)
        except Exception as e:
            logger.error("[OrderService] Failed to fetch vet %s: %s", order.vet_id, str(e))

        if mobile_vet:
            sms_vet_event = {
                "event_type": "SEND_SMS",
                "event_version": 1,
                "order_id": order.id,
                "mobile": mobile_vet,
                "template": "VET_ORDER_CREATED",  # template جدید برای vet
                "params": {
                    "order_id": order.id,
                    "pet_name": pet_detail.get("name") if pet_detail else "",
                    "owner_id": order.owner_id,  # برای message: "از owner {owner_id}"
                    "owner_name": owner_name,  # از variable owner_name استفاده کن
                },
                "purchase_id": base_event["purchase_id"],
            }
            try:
                producer.send(
                    topic="vetform_topic",
                    key=f"vet-sms-{order.id}".encode("utf-8"),  # key متفاوت برای vet
                    value=sms_vet_event,
                )
                logger.debug("[OrderService] Vet SMS event sent for order_id=%s", order.id)
            except Exception as e:
                logger.error("[OrderService] Failed to send vet SMS for order_id=%s: %s", order.id, str(e))
        else:
            logger.info("[OrderService] Skipping vet SMS for order_id=%s (no mobile)", order.id)

        # SMS برای Support
        support_mobile = os.getenv("SUPPORT_MOBILE", None)  # fixed از env – شماره پشتیبان
        if support_mobile and owner_name:  # فقط اگر support mobile ست باشه و owner_name موجود
            sms_support_event = {
                "event_type": "SEND_SMS",
                "event_version": 1,
                "order_id": order.id,
                "mobile": support_mobile,
                "template": "SUPPORT_ORDER_CREATED",  # template جدید
                "params": {
                    "order_id": order.id,
                    "owner_name": owner_name,
                    "pet_name": pet_detail.get("name") if pet_detail else "",
                },
                "purchase_id": base_event["purchase_id"],
            }
            try:
                producer.send(
                    topic="vetform_topic",
                    key=f"support-sms-{order.id}".encode("utf-8"),
                    value=sms_support_event,
                )
                logger.debug("[OrderService] Support SMS event sent for order_id=%s", order.id)
            except Exception as e:
                logger.error("[OrderService] Failed to send support SMS for order_id=%s: %s", order.id, str(e))
        else:
            logger.info("[OrderService] Skipping support SMS for order_id=%s (no support mobile or owner name)", order.id)

        # Flush producer برای اطمینان از ارسال
        try:
            producer.flush(timeout=10)  # ۱۰ ثانیه timeout، غیربلوکی
            logger.debug("[OrderService] Producer flushed for order_id=%s", order.id)
        except Exception as e:
            logger.warning("[OrderService] Producer flush failed for order_id=%s: %s", order.id, str(e))

        # Log نهایی (با support SMS)
        logger.info(
            "[OrderService] Events processed for order_id=%s (vet: yes, owner SMS: %s, vet SMS: %s, support SMS: %s)",
            order.id,
            "yes" if mobile_owner else "no",
            "yes" if mobile_vet else "no",
            "yes" if support_mobile and owner_name else "no"
        )

    except Exception as e:
        logger.error("[OrderService] Unexpected error in send_order_event_to_vet for order_id=%s: %s", order.id, str(e))