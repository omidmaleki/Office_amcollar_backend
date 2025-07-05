# device_information/serializers.py
from rest_framework import serializers
from .models import DeviceInformation

class DeviceInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceInformation
        fields = '__all__'
