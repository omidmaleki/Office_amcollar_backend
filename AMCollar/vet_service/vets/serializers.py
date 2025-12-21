from rest_framework import serializers
from .models import Vet, VetForm, VetInfoMedical
from rest_framework.exceptions import ValidationError
import requests

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
            "created_at",
            "rank"
        ]


class VetFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetForm
        fields = '__all__'


OWNER_SERVICE_URL = "http://owner:8000/owners/"
class VetInfoMedicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetInfoMedical
        fields = '__all__'

    def validate(self, data):
        owner_id = data.get("owner_id")
        owner_name = data.get("owner_name")

        if not owner_id:
            raise serializers.ValidationError({"owner_id": "owner_id is required."})
        if not owner_name:
            raise serializers.ValidationError({"owner_name": "owner_name is required."})

        try:
            resp = requests.get(f"{OWNER_SERVICE_URL}{owner_id}/")
            if resp.status_code != 200:
                raise serializers.ValidationError({"owner_id": f"Owner with id {owner_id} does not exist in Owner service."})
        except requests.RequestException:
            raise serializers.ValidationError({"owner_service": "Cannot reach Owner service to validate owner_id."})

        return data


class VetRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vet
        fields = [
            "id",
            "name",
            "phone",
            "vet_license_number",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_phone(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("شماره تماس معتبر نیست.")
        return value

    # def validate_vet_license_number(self, value):
    #     if len(value) < (5:8):
    #         raise serializers.ValidationError("شماره پروانه معتبر نیست.")
    #     return value

    def create(self, validated_data):
        return Vet.objects.create(
            **validated_data,
            address="",
            pets=[],
            collars=[],
            activated=True,
            rank="star",
        )