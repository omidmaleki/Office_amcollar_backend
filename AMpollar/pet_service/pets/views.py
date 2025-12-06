from rest_framework import viewsets
from .models import Pet, Threshold
from .serializers import PetSerializer, ThresholdSerializer
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
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


class ThresholdViewSet(ModelViewSet):
    queryset = Threshold.objects.all()
    serializer_class = ThresholdSerializer



