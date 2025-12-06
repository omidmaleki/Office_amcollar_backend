from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "vet_id",
            "owner_id",
            "collar_id",
            "amount",
            "payment_id",
            "status",
            "created_at"
        ]
