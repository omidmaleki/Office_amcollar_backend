# shopping/serializers.py
from rest_framework import serializers
from shopping.models import Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
