import requests
from django.conf import settings

SMS_SERVICE = settings.SMS_SERVICE
OWNER_SERVICE = settings.OWNER_SERVICE
VET_SERVICE = settings.VET_SERVICE


def trigger_alert(pet_id: int, alert_type: str, value=None):
    """
    alert_type examples:
    - high_activity
    - low_activity
    - abnormal_sleep
    """

    alert_payload = {
        "pet_id": pet_id,
        "type": alert_type,
        "value": value
    }

    # مثال: ارسال به Owner Service
    requests.post(
        f"{OWNER_SERVICE}/api/alerts/",
        json=alert_payload,
        timeout=3
    )

    # مثال: ارسال SMS (اختیاری)
    if alert_type in ["high_activity", "abnormal_sleep"]:
        requests.post(
            f"{SMS_SERVICE}/api/send/",
            json={
                "pet_id": pet_id,
                "message": f"Alert: {alert_type}"
            },
            timeout=3
        )
