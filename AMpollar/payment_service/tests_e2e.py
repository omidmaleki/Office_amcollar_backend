from payment.producer import send_payment_event
import time

# ارسال پیام تستی
send_payment_event(payment_id=123, status="PAID")

# کمی صبر کن تا order_service دریافت کنه
time.sleep(5)

print("Check order_service logs to see if the message was received.")
