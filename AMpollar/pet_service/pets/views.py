from rest_framework import viewsets
from .models import Pet, PetCategory
from .serializers import PetSerializer, PetCategorySerializer

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class PetCategoryViewSet(viewsets.ModelViewSet):
    queryset = PetCategory.objects.all()
    serializer_class = PetCategorySerializer
