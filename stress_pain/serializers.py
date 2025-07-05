# stress_pain/serializers.py
from rest_framework import serializers
from .models import StressPainRecord

class StressPainRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StressPainRecord
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'stress_level', 'notes')
