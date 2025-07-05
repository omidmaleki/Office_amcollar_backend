# owner_thresholds/serializers.py
from rest_framework import serializers
from .models import OwnerThreshold

class OwnerThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerThreshold
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'owner')
