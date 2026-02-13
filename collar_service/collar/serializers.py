from rest_framework import serializers
from .models import Collar, WifiCollarStatus

class CollarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collar
        fields = "__all__"

class WifiCollarStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = WifiCollarStatus
        fields = "__all__"