from django.db import transaction, IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from order.models import Order
from order.serializers import OrderSerializer
import requests

class CreatePaymentView(APIView):
    def post(self, request):
        owner_id = request.data.get("owner_id")
        collar_id = request.data.get("collar_id")
        vet_id = request.data.get("vet_id")
        pet_id = request.data.get("pet_id")  # می‌تونی pet_id را بعداً به Order اضافه کنی

        if not owner_id or not collar_id:
            return Response({"error": "owner_id and collar_id required"}, status=400)

        try:
            r = requests.get(f"http://collar:8000/collars/{collar_id}/")
            r.raise_for_status()
            amount = r.json().get("price")
        except:
            return Response({"error": "collar service unreachable"}, status=503)

        payment = Payment.objects.create(
            owner_id=owner_id,
            collar_id=collar_id,
            vet_id=vet_id,
            amount=amount,
            status="success"
        )

        # Order توسط Signal ساخته می‌شود
        order_data = None
        try:
            order_data = OrderSerializer(payment.order).data
        except Order.DoesNotExist:
            order_data = None

        return Response({
            "payment": PaymentSerializer(payment).data,
            "order": order_data
        }, status=201)
