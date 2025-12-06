from rest_framework.viewsets import ModelViewSet
from .models import Threshold
from .serializers import ThresholdSerializer

class ThresholdViewSet(ModelViewSet):
    queryset = Threshold.objects.all()
    serializer_class = ThresholdSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        pet_id = self.request.query_params.get("pet_id")
        if pet_id:
            qs = qs.filter(pet_id=pet_id)
        return qs
