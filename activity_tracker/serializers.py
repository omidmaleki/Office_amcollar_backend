# activity_tracker/serializers.py
from rest_framework import serializers
from .models import ActivityRecord

class ActivityRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityRecord
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
