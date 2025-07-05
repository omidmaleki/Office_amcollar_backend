from rest_framework import generics, permissions
from .models import GeoFence
from .serializers import GeoFenceSerializer
from owner_thresholds.models import OwnerThreshold
from rest_framework.exceptions import ValidationError

class GeoFenceListCreateView(generics.ListCreateAPIView):
    queryset = GeoFence.objects.all()
    serializer_class = GeoFenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        pet = serializer.validated_data.get('pet')
        collar = serializer.validated_data.get('collar')
        owner = self.request.user  # از یوزر لاگین شده بگیر

        print(f"[DEBUG] Owner: {owner}, Pet: {pet}, Collar: {collar}")

        try:
            threshold = OwnerThreshold.objects.get(owner=owner, pet=pet, collar=collar)
            print(f"[DEBUG] Found threshold with radius: {threshold.geofence_radius}")
            serializer.save(radius_meters=threshold.geofence_radius)
        except OwnerThreshold.DoesNotExist:
            print("[ERROR] OwnerThreshold not found for this owner, pet, collar!")
            raise ValidationError("OwnerThreshold برای این حیوان و صاحب تعریف نشده است.")

class GeoFenceRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GeoFence.objects.all()
    serializer_class = GeoFenceSerializer
    permission_classes = [permissions.IsAuthenticated]
