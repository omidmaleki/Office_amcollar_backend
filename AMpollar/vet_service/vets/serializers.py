from rest_framework import serializers
from .models import Vet, VetForm

class VetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vet
        fields = [
            "id",
            "name",
            "phone",
            "address",
            "pets",
            "collars",
            "activated",
            "vet_license_number",
            "created_at"
        ]


class VetFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetForm
        fields = [
            "id",
            "owner_id",
            "pet_id",
            "purchase_id",
            "status",
            "created_at"
        ]