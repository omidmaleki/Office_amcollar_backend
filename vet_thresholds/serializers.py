# vet_thresholds/serializers.py
from rest_framework import serializers
from .models import VetThreshold

class VetThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetThreshold
        fields = '__all__'
        read_only_fields = ('created_at', 'thresholds_updated', 'vet')
