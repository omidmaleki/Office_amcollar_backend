from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone
from datetime import timedelta
from .serializers import SendOtpSerializer, VerifyOtpSerializer
from .models import OTP, Owner
import random
import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import os

GATEWAY_SMS_URL = os.environ.get("GATEWAY_URL", "http://gateway:8000") + "/sms/"


def generate_code():
    return f"{random.randint(1000, 9999)}"


class BaseSendOtpView(APIView):
    """Parent class shared by owner/provider OTP send logic."""
    permission_classes = (permissions.AllowAny,)
    role = None  # must be overridden

    def post(self, request):
        serializer = SendOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone"]

        code = generate_code()
        code_hash = OTP.make_hash(code)
        expires = timezone.now() + timedelta(minutes=5)

        OTP.objects.create(
            phone=phone,
            role=self.role,
            code_hash=code_hash,
            expires_at=expires
        )

        try:
            resp = requests.post(GATEWAY_SMS_URL, json={"phone": phone, "code": code})
            return Response({
                "success": True,
                "role": self.role,
                "sms_response": resp.json()
            }, status=200)

        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)


class BaseVerifyOtpView(APIView):
    """Parent class for verifying OTP for owner/provider."""
    permission_classes = (permissions.AllowAny,)
    role = None  # must be overridden

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        code = serializer.validated_data["code"]
        code_hash = OTP.make_hash(code)

        now = timezone.now()

        otp_qs = OTP.objects.filter(
            phone=phone,
            role=self.role,
            code_hash=code_hash,
            used=False,
            expires_at__gt=now
        ).order_by("-created_at")

        if not otp_qs.exists():
            return Response({"success": False, "message": "Invalid or expired code"}, status=400)

        otp = otp_qs.first()
        otp.used = True
        otp.save()

        # Create or get owner
        owner, _ = Owner.objects.get_or_create(phone=phone, defaults={"role": self.role})

        # If owner exists but role mismatch, update
        if owner.role != self.role:
            owner.role = self.role
            owner.save()

        refresh = RefreshToken.for_user(owner)
        refresh["role"] = owner.role
        refresh["phone"] = owner.phone

        return Response({
            "success": True,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": owner.role,
            "expires_in": int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        }, status=200)


# Concrete owner/provider views
class OwnerSendOtpView(BaseSendOtpView):
    role = "owner"


class OwnerVerifyOtpView(BaseVerifyOtpView):
    role = "owner"


class VetSendOtpView(BaseSendOtpView):
    role = "vet"


class VetVerifyOtpView(BaseVerifyOtpView):
    role = "vet"


class AssignRoleView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request):
        phone = request.data.get("phone")
        role = request.data.get("role")

        if not phone or not role:
            return Response({"success": False, "message": "phone and role required"}, status=400)

        owner, _ = Owner.objects.get_or_create(phone=phone)
        owner.role = role
        owner.save()

        return Response({"success": True, "phone": owner.phone, "role": owner.role}, status=200)
