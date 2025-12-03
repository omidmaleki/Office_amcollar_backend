import uuid
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment
from .serializers import PaymentSerializer
from .producer import send_payment_event

class CreatePaymentView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        collar_id = request.data.get("collar_id")

        if not user_id or not collar_id:
            return Response({"error": "user_id and collar_id are required"}, status=400)

        # دریافت قیمت از Collar Service
        try:
            response = requests.get(f"http://collar:8000/collars/{collar_id}/", timeout=5)
            if response.status_code != 200:
                return Response({"error": "Collar not found"}, status=404)
            product = response.json()
            amount = product.get("price")
            if amount is None:
                return Response({"error": "Collar price not found"}, status=400)
        except requests.RequestException:
            return Response({"error": "Failed to connect to Collar Service"}, status=503)

        # ایجاد Payment
        transaction_id = str(uuid.uuid4())
        payment = Payment.objects.create(
            user_id=user_id,
            collar_id=collar_id,
            amount=amount,
            status="success",
            transaction_id=transaction_id
        )

        # ---------------- Kafka Event ----------------
        event_data = {
            "user_id": user_id,
            "collar_id": collar_id,
            "amount": float(amount),
            "payment_id": transaction_id
        }
        send_payment_event(event_data)

        return Response(PaymentSerializer(payment).data, status=201)


