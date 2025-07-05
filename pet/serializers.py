# pet/serializers.py
from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    vet_username = serializers.CharField(source='vet.username', read_only=True)

    class Meta:
        model = Pet
        fields = [
            'id',
            'name',
            'species',
            'breed',
            'age_months',
            'gender',
            'neutered',
            'weight_kg',
            'surgery_history',
            'radiography_images',
            'blood_test_images',
            'annual_vaccine_date',
            'other_vaccine_date',
            'owner',
            'vet',
            'owner_username',
            'vet_username',
            'created_at',
        ]
        read_only_fields = ['created_at']
