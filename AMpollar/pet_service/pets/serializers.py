from rest_framework import serializers
from .models import Pet, PetCategory

class PetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetCategory
        fields = '__all__'

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'
