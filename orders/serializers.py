# orders/serializers.py
from rest_framework import serializers
from .models import Order
from collar.models import Collar
from users.models import User

class OrderSerializer(serializers.ModelSerializer):
    collar_id = serializers.PrimaryKeyRelatedField(
        queryset=Collar.objects.filter(owner__isnull=True),  # فقط قلاده‌هایی که هنوز فروخته نشدن
        source='collar',
        write_only=True
    )
    vet_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='vet', is_active=True),
        source='vet',
        write_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id',
            'owner',
            'vet_id',
            'collar_id',
            'customer_mobile',
            'pet_name',
            'status',
            'created_at',
            'paid_at',
        ]
        read_only_fields = ['id', 'owner', 'status', 'created_at', 'paid_at']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['owner'] = request.user
        order = Order.objects.create(**validated_data)

        # اتصال دامپزشک و صاحب به قلاده
        collar = order.collar
        collar.owner = order.owner
        collar.save()

        return order
