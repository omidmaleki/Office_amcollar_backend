from rest_framework import serializers
from .models import Collar

class CollarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collar
        fields = "__all__"
