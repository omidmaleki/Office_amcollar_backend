# vet_thresholds/views.py
from rest_framework import generics, permissions
from .models import VetThreshold
from .serializers import VetThresholdSerializer

class VetThresholdListCreateView(generics.ListCreateAPIView):
    serializer_class = VetThresholdSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # دامپزشک فقط رکوردهای خودش رو می‌بینه
        user = self.request.user
        return VetThreshold.objects.filter(vet=user)

    def perform_create(self, serializer):
        serializer.save(vet=self.request.user)


class VetThresholdRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VetThreshold.objects.all()
    serializer_class = VetThresholdSerializer
    permission_classes = [permissions.IsAuthenticated]
