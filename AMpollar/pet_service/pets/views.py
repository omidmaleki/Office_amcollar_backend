from rest_framework import viewsets
from .models import Pet
from .serializers import PetSerializer
from rest_framework.response import Response

# Pet Service
class PetViewSet(viewsets.ModelViewSet):
    serializer_class = PetSerializer

    def get_queryset(self):
        qs = Pet.objects.all()
        owner_id = self.request.query_params.get("owner_id")
        if owner_id:
            qs = qs.filter(owner_id=owner_id)
        return qs

    def perform_create(self, serializer):
        serializer.save()




