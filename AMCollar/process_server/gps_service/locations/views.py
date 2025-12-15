from rest_framework.viewsets import ModelViewSet
from .models import Location, Geofence, Route
from .serializers import (
    LocationSerializer,
    GeofenceSerializer,
    RouteSerializer
)


class LocationViewSet(ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class GeofenceViewSet(ModelViewSet):
    queryset = Geofence.objects.all()
    serializer_class = GeofenceSerializer


class RouteViewSet(ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
