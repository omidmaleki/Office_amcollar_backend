from rest_framework import serializers
from .models import Pet, Threshold

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = "__all__"


class ThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Threshold
        fields = "__all__"