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

class VetNewOrderSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    owner_name = serializers.CharField(allow_null=True)
    pet_name = serializers.CharField(allow_null=True)
    pet_image = serializers.CharField(allow_null=True)
    purchase_date = serializers.DateTimeField()