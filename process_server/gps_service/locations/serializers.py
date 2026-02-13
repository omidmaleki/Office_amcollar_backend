from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Location, Geofence, Route


class LocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Location
        geo_field = "point"
        fields = "__all__"


class GeofenceSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Geofence
        geo_field = "area"
        fields = "__all__"


class RouteSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Route
        geo_field = "path"
        fields = "__all__"
