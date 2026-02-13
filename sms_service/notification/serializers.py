from rest_framework import serializers
from .models import Veterinary, ContactUs


class VeterinarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Veterinary
        fields = '__all__'


class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'
