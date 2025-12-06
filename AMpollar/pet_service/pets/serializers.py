from rest_framework import serializers
from .models import Pet, Threshold

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ["id", "name", "species", "owner_id", "vet_id", "collar_id"]


class ThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Threshold
        fields = "__all__"