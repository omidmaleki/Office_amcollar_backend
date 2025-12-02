import uuid
import json
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from kafka import KafkaProducer
from kafka.errors import KafkaError
from .models import Payment
from .serializers import PaymentSerializer

KAFKA_PRODUCER = KafkaProducer(
    bootstrap_servers="kafka:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

import uuid
import json
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from kafka import KafkaProducer
from kafka.errors import KafkaError
from .models import Payment
from .serializers import PaymentSerializer

class CreatePaymentView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        product_id = request.data.get("product_id")

        if not user_id or not product_id:
            return Response(
                {"error": "user_id and product_id are required"},
                status=400
            )

        # دریافت قیمت کالا از Product Service
        try:
            response = requests.get(f"http://product:8000/products/{product_id}/", timeout=5)
            if response.status_code != 200:
                return Response({"error": "Product not found"}, status=404)
            product = response.json()
            amount = product.get("price")
            if amount is None:
                return Response({"error": "Product price not found"}, status=400)
        except requests.RequestException:
            return Response({"error": "Failed to connect to Product Service"}, status=503)

        # ایجاد Payment
        transaction_id = str(uuid.uuid4())
        payment = Payment.objects.create(
            user_id=user_id,
            product_id=product_id,
            amount=amount,
            status="success",
            transaction_id=transaction_id
        )

        # ---------------- Kafka Producer ----------------
        try:
            producer = KafkaProducer(
                bootstrap_servers="kafka:9092",
                value_serializer=lambda v: json.dumps(v).encode("utf-8")
            )

            future = producer.send("order_created", {
                "user_id": user_id,
                "product_id": product_id,
                "amount": float(amount),
                "payment_id": transaction_id
            })

            # انتظار برای تأیید ارسال پیام و بررسی خطا
            record_metadata = future.get(timeout=10)
            print(f"✅ Kafka message sent to topic {record_metadata.topic}, partition {record_metadata.partition}, offset {record_metadata.offset}")

            producer.flush()
            producer.close()

        except KafkaError as e:
            print(f"⚠️ Kafka Error: {e}")

        return Response(PaymentSerializer(payment).data, status=201)

