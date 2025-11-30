from rest_framework import viewsets
from .models import Pet
from .serializers import PetSerializer
from rest_framework.response import Response

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer



