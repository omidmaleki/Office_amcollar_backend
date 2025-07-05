# gps/views.py
from rest_framework import generics
from .models import GPS
from .serializers import GPSSerializer
from rest_framework.permissions import IsAuthenticated

from geofence.models import GeoFence
from alerts.models import Alert
from django.utils import timezone
from math import radians, cos, sin, asin, sqrt


class GPSCreateView(generics.CreateAPIView):
    queryset = GPS.objects.all()
    serializer_class = GPSSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        gps_instance = serializer.save()

        collar = gps_instance.collar
        pet = gps_instance.pet

        # بررسی وجود Geofence فعال
        try:
            geofence = GeoFence.objects.get(pet=pet, is_active=True)
        except GeoFence.DoesNotExist:
            print("No active geofence found for this pet.")
            return

        # محاسبه فاصله با مرکز Geofence
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371000  # شعاع زمین به متر
            lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
            c = 2 * asin(sqrt(a))
            return R * c

        distance = haversine(
            gps_instance.gps_lat,
            gps_instance.gps_lon,
            geofence.center_lat,
            geofence.center_lon
        )

        print(f"Distance: {distance}, radius: {geofence.radius_meters}")
        # بررسی و ایجاد هشدار بر اساس فاصله
        if distance >= geofence.radius_meters:
            alert = Alert.objects.create(
                pet=pet,
                collar=collar,
                alert_type=Alert.AlertType.GEOFENCE,
                alert_level=Alert.AlertLevel.CRITICAL,
                alert_message=f"Pet has exited the geofence zone. Distance: {int(distance)} meters",
                alert_timestamp=timezone.now(),
                related_object=gps_instance
            )
            print("Created CRITICAL alert:", alert)
        elif distance >= geofence.radius_meters * 0.9:
            alert = Alert.objects.create(
                pet=pet,
                collar=collar,
                alert_type=Alert.AlertType.GEOFENCE,
                alert_level=Alert.AlertLevel.WARNING,
                alert_message=f"Pet is near the geofence boundary. Distance: {int(distance)} meters",
                alert_timestamp=timezone.now(),
                related_object=gps_instance
            )

            print("Created WARNING alert:", alert)
class GPSListView(generics.ListAPIView):
    queryset = GPS.objects.all()
    serializer_class = GPSSerializer
    permission_classes = [IsAuthenticated]
