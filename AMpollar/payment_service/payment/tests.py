from .producer import send_payment_event
import time

def test_send_payment_event():
    # ارسال پیام تستی
    send_payment_event(payment_id=123, status="PAID")

    # کمی صبر کن تا order_service پیام دریافت کنه
    time.sleep(3)
    print("Message sent! Check order_service logs for reception.")