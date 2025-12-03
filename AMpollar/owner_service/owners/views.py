from rest_framework import viewsets
from rest_framework.views import APIView
from .models import Owner
from .serializers import OwnerSerializer
from rest_framework.response import Response
from rest_framework import status
import requests
from django.db import IntegrityError, transaction


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        required_fields = ["phone", "name"]
        for f in required_fields:
            if f not in data:
                return Response(
                    {"detail": f"{f} is required"},
                    status=400
                )

        if Owner.objects.filter(phone=data["phone"]).exists():
            return Response(
                {"detail": "این شماره قبلاً ثبت شده است."},
                status=409
            )

        try:
            with transaction.atomic():
                owner = Owner.objects.create(
                    phone=data["phone"],
                    name=data["name"],
                    address=data.get("address", ""),
                    vet_id=data.get("vet_id"),
                    collar_ids=data.get("collar_ids", {}),
                    pet_ids=data.get("pet_ids", []),
                )

        except Exception as e:
            return Response(
                {"detail": f"خطا در ایجاد مالک: {str(e)}"},
                status=500
            )

        serializer = OwnerSerializer(owner)
        return Response(serializer.data, status=201)


GATEWAY_URL = "http://gateway:8000/sms/"

class SendOtpView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        otp_code = request.data.get("otp_code")
        if not phone or not otp_code:
            return Response({"success": False, "message": "phone and OTP required"}, status=400)

        payload = {"phone": phone, "code": otp_code}
        try:
            resp = requests.post(GATEWAY_URL, json=payload, timeout=5)
            resp.raise_for_status()
            return Response(resp.json())
        except requests.exceptions.RequestException as e:
            return Response({"success": False, "message": str(e)}, status=500)