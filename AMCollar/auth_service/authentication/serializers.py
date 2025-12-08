from rest_framework import serializers
from .models import Owner

class SendOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=32)

class VerifyOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=32)
    code = serializers.CharField(max_length=16)

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ["phone", "role", "is_active"]