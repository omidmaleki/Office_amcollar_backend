# sms/view.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import sms_service
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(["POST"])
def sms_send(request):
    phone = request.data.get("phone")
    code = request.data.get("code")

    result = sms_service.send_otp(phone, code)
    return Response(result)
