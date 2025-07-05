# water_food/serializers.py
from rest_framework import serializers
from .models import WaterFoodContainer, WaterFoodRecord

class WaterFoodContainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterFoodContainer
        fields = '__all__'
        read_only_fields = ['created_at']

class WaterFoodRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterFoodRecord
        fields = '__all__'
        read_only_fields = ['created_at']
