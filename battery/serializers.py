# battery/serializers.py
from rest_framework import serializers
from .models import Battery

class BatterySerializer(serializers.ModelSerializer):
    class Meta:
        model = Battery
        fields = [
            'id', 'collar', 'battery_serial', 'capacity_mah', 'voltage',
            'battery_level', 'battery_timestamp', 'installed_date', 'replaced_date', 'is_active', 'created_at'
        ]
        read_only_fields = ('id', 'created_at')
