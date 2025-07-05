# system_thresholds/serializers.py
from rest_framework import serializers
from .models import PetCategory, SystemThreshold

class PetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetCategory
        fields = '__all__'

class SystemThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemThreshold
        fields = '__all__'
