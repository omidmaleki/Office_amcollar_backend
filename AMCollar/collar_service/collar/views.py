from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from .models import Collar, WifiCollarStatus
from .serializers import CollarSerializer, WifiCollarStatusSerializer

class CollarViewSet(ModelViewSet):
    queryset = Collar.objects.all()
    serializer_class = CollarSerializer

class WifiCollarStatusViewSet(viewsets.ModelViewSet):
    queryset = WifiCollarStatus.objects.all()
    serializer_class = WifiCollarStatusSerializer

    # فیلتر بر اساس owner_id
    def get_queryset(self):
        qs = super().get_queryset()
        owner_id = self.request.query_params.get("owner_id")
        if owner_id:
            qs = qs.filter(owner_id=owner_id)
        return qs