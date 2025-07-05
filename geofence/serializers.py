# geofence/serializers.py
from rest_framework import serializers
from .models import GeoFence

class GeoFenceSerializer(serializers.ModelSerializer):
    radius_meters = serializers.FloatField(required=False)

    class Meta:
        model = GeoFence
        fields = '__all__'
