import logging
from celery import shared_task
from django.conf import settings
from sms_ir import SmsIr  # import library (pip install sms-ir)
import requests

logger = logging.getLogger(__name__)

# Message templates (لوکال-friendly: بدون لینک real، فقط order_id و pet_name)
MESSAGE_TEMPLATES = {
    "ORDER_CREATED": "سفارشی برای شما ثبت شده. سفارش شماره {order_id}. (نام حیوان: {pet_name})",
    "VET_ORDER_CREATED": "سفارش جدیدی برای شما ثبت شد از owner {owner_id}. (حیوان: {pet_name}, سفارش: {order_id})",  # **جدید: برای vet**
    "DEFAULT": "پیامی از AMCollar: {message}",
}

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=60,
    retry_kwargs={"max_retries": 5},
    retry_jitter=True,
)
def send_sms_task(self, event):
    logger.info(f"[SMS Task] Processing event: {event}")

    # Extract از event (با fallback)
    mobile = event.get("mobile") or event.get("phone")
    template_name = event.get("template") or event.get("event_type", "DEFAULT").replace("SEND_SMS", "")
    params = event.get("params", {})  # مثل {"order_id": 2, "pet_name": "ali"}
    custom_message = params.get("message", "")  # message مستقیم اگر باشه

    if not mobile:
        raise ValueError("شماره موبایل (mobile/phone) در event موجود نیست!")

    # Message بساز (با safe format برای جلوگیری از KeyError)
    if custom_message:
        message = custom_message
    else:
        message_template = MESSAGE_TEMPLATES.get(template_name, MESSAGE_TEMPLATES["DEFAULT"])
        # فقط کلیدهای موجود رو inject کن (fallback اگر missing باشه)
        available_params = {k: v for k, v in params.items() if f"{{{k}}}" in message_template}
        try:
            message = message_template.format(**available_params)
        except KeyError as e:
            logger.warning(f"[SMS Task] Missing param '{e}' in template '{template_name}', using fallback message")
            message = f"سفارشی برای شما ثبت شده. سفارش شماره {params.get('order_id', 'نامشخص')}."  # fallback ساده

    # Check settings
    if not settings.SMSIR_API_KEY or not settings.SMSIR_LINE_NUMBER:
        raise ValueError("SMSIR_API_KEY یا SMSIR_LINE_NUMBER در settings ست نشده!")

    # SmsIr init
    sms_ir = SmsIr(
        api_key=settings.SMSIR_API_KEY,
        linenumber=settings.SMSIR_LINE_NUMBER,
    )

    try:
        logger.info(f"[SMS Task] ارسال SMS به {mobile}: '{message[:50]}...'")
        result = sms_ir.send_sms(
            number=mobile,
            message=message,
            linenumber=settings.SMSIR_LINE_NUMBER,
        )

        # Response handling (فیکس: status int رو handle کن)
        if result.status_code == 200:  # HTTP success
            response_data = result.json()  # به dict تبدیل کن
            status = response_data.get('status')  # int: 1=موفق، 0=خطا

            # Check برای success (int یا string)
            if status == 1 or status in ['success', 'موفق']:  # فیکس: int 1 رو catch کن
                sms_id = response_data.get('id', response_data.get('messageId', 'N/A'))  # id یا messageId
                logger.info(f"[SMS Task] SMS ارسال شد: ID {sms_id}")
                return {"status": "success", "sms_id": sms_id, "mobile": mobile}
            else:
                error_msg = response_data.get('message', f"Status: {status}")
                logger.error(f"[SMS Task] API error: {error_msg}")
                raise ValueError(f"API response error: {error_msg}")
        else:
            logger.error(f"[SMS Task] HTTP error: Status {result.status_code}, Response: {result.text}")
            raise ValueError(f"HTTP {result.status_code}: {result.text}")

    except requests.exceptions.RequestException as e:  # Network/HTTP errors
        logger.exception(f"[SMS Task] Request failed: {e}")
        raise  # retry
    except ValueError as e:
        logger.error(f"[SMS Task] Validation error: {e}")
        raise  # retry
    except Exception as e:
        logger.exception(f"[SMS Task] Unexpected error: {e}")
        raise  # retry