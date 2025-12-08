from django.db import transaction, IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
import requests

from .models import Payment
from .serializers import PaymentSerializer
from order.models import Order
from order.serializers import OrderSerializer

COLLAR_SERVICE = "http://collar:8000"
PET_SERVICE = "http://pet:8000"

class CreatePaymentView(APIView):
    def post(self, request):
        owner_id = request.data.get("owner_id")
        collar_id = request.data.get("collar_id")
        vet_id = request.data.get("vet_id")
        pet_id = request.data.get("pet_id")

        if not owner_id or not collar_id or not pet_id:
            return Response({"error": "owner_id, collar_id and pet_id required"}, status=400)

        # دریافت قیمت Collar
        try:
            r = requests.get(f"{COLLAR_SERVICE}/collars/{collar_id}/", timeout=5)
            r.raise_for_status()
            amount = r.json().get("price")
        except requests.RequestException:
            return Response({"error": "Collar service unreachable"}, status=503)

        try:
            # ساخت Payment
            payment = Payment.objects.create(
                owner_id=owner_id,
                collar_id=collar_id,
                vet_id=vet_id,
                amount=amount,
                status="success"
            )

            # آپدیت Pet
            try:
                pet_update = requests.patch(
                    f"{PET_SERVICE}/pets/{pet_id}/",
                    json={"collar_id": collar_id},
                    timeout=5
                )
                pet_update.raise_for_status()
            except requests.RequestException:
                print(f"Failed to update pet {pet_id} with collar_id {collar_id}")

            return Response({
                "payment": PaymentSerializer(payment).data,
                # Order توسط سیگنال ساخته می‌شود
                "order": "Order will be created automatically by signal"
            }, status=201)

        except IntegrityError as e:
            return Response({"error": str(e)}, status=400)