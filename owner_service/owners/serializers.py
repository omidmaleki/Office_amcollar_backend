from rest_framework import serializers
from .models import Owner

class OwnerSerializer(serializers.ModelSerializer):
    pet_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False
    )
    collar_ids = serializers.DictField(required=False)
    vet_id = serializers.IntegerField(required=False)

    class Meta:
        model = Owner
        fields = ["id", "name", "phone", "address", "vet_id", "pet_ids", "collar_ids"]

