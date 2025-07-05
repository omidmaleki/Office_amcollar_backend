# owner_thresholds/views.py
from rest_framework import generics, permissions
from .models import OwnerThreshold
from .serializers import OwnerThresholdSerializer

class OwnerThresholdListCreateView(generics.ListCreateAPIView):
    serializer_class = OwnerThresholdSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OwnerThreshold.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class OwnerThresholdRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OwnerThreshold.objects.all()
    serializer_class = OwnerThresholdSerializer
    permission_classes = [permissions.IsAuthenticated]
