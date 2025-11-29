import requests
from django.conf import settings

# sms/services.py
class SmsService:
    def __init__(self):
        self.api_key = settings.SMSIR_API_KEY
        self.template_id = settings.SMSIR_TEMPLATE_ID

    def send_otp(self, phone, code):
        url = "https://api.sms.ir/v1/send/verify"
        headers = {
            "Content-Type": "application/json",
            "Accept": "text/plain",
            "x-api-key": self.api_key
        }
        payload = {
            "mobile": phone,
            "templateId": self.template_id,
            "parameters": [{"name": "CODE", "value": code}]
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
            resp.raise_for_status()  # خطای HTTP
            return resp.json()
        except requests.RequestException as e:
            return {"success": False, "message": f"Request error: {str(e)}"}
        except ValueError:
            return {"success": False, "message": "Invalid JSON from SMS.ir"}

sms_service = SmsService()

# test
# print(sms_service.send_otp("09306094055", "sla"))

