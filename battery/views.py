# battery/views.py
from rest_framework import generics, permissions
from .models import Battery
from .serializers import BatterySerializer

class BatteryListCreateView(generics.ListCreateAPIView):
    queryset = Battery.objects.all()
    serializer_class = BatterySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save()

class BatteryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Battery.objects.all()
    serializer_class = BatterySerializer
    permission_classes = [permissions.IsAuthenticated]
