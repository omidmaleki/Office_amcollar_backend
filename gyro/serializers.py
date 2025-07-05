# gyro/serializers.py
from rest_framework import serializers
from .models import Gyro

class GyroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gyro
        fields = '__all__'
