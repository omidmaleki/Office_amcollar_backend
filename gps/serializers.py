# gps/serializers.py
from rest_framework import serializers
from .models import GPS

class GPSSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPS
        fields = '__all__'
