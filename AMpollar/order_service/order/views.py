from rest_framework import viewsets
from .models import Order
from .serializers import OrderSerializer, VetNewOrderSerializer

from rest_framework.response import Response
import requests

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer



PET_SERVICE = "http://pet:8000"
OWNER_SERVICE = "http://owner:8000"

class VetNewOrderViewSet(viewsets.ViewSet):
    """
    نمایش سفارش‌های جدید به Vet
    شامل نام Owner، نام و عکس Pet و تاریخ خرید
    """
    def list(self, request):
        orders = Order.objects.all().order_by('-created_at')
        results = []

        for order in orders:
            # Owner info
            try:
                owner_resp = requests.get(f"{OWNER_SERVICE}/owners/{order.owner_id}/", timeout=5)
                owner_resp.raise_for_status()
                owner_name = owner_resp.json().get("name")
            except:
                owner_name = None

            # Pet info
            try:
                pet_resp = requests.get(f"{PET_SERVICE}/pets/{order.pet_id}/", timeout=5)
                pet_resp.raise_for_status()
                pet_data = pet_resp.json()
                pet_name = pet_data.get("name")
                pet_image = pet_data.get("pet_image")
            except:
                pet_name = None
                pet_image = None

            results.append({
                "order_id": order.id,
                "owner_name": owner_name,
                "pet_name": pet_name,
                "pet_image": pet_image,
                "purchase_date": order.created_at
            })

        serializer = VetNewOrderSerializer(results, many=True)
        return Response(serializer.data)