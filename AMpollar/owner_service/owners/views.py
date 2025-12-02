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

        try:
            with transaction.atomic():
                # اگر owner با این شماره وجود دارد، آپدیت کن
                owner, created = Owner.objects.get_or_create(
                    phone=data["phone"],
                    defaults={
                        "name": data["name"],
                        "address": data.get("address", ""),
                        "vet_id": data.get("vet_id")
                    }
                )

                if not created:
                    # update اطلاعات موجود
                    owner.name = data.get("name", owner.name)
                    owner.address = data.get("address", owner.address)
                    owner.vet_id = data.get("vet_id", owner.vet_id)

                # collar_ids
                collar_ids = data.get("collar_ids", {})
                if not owner.collar_ids:
                    owner.collar_ids = {}
                owner.collar_ids.update(collar_ids)

                # pet_ids: اضافه کردن Pet ثبت شده
                pet_ids = data.get("pet_ids", [])
                if not owner.pet_ids:
                    owner.pet_ids = []
                for pid in pet_ids:
                    if pid not in owner.pet_ids:
                        owner.pet_ids.append(pid)

                owner.save()

        except IntegrityError:
            return Response(
                {"detail": "این شماره قبلاً ثبت شده است."},
                status=status.HTTP_409_CONFLICT
            )
        except (ValueError, TypeError) as e:
            return Response(
                {"detail": f"داده‌ها معتبر نیستند: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except KeyError as e:
            return Response(
                {"detail": f"کلید مورد نیاز موجود نیست: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OwnerSerializer(owner)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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