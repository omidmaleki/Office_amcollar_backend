# geofence/admin.py
from django.contrib import admin
from .models import GeoFence

@admin.register(GeoFence)
class GeoFenceAdmin(admin.ModelAdmin):
    list_display = ("pet", "collar", "center_lat", "center_lon", "radius_meters", "is_active", "last_updated")
    list_filter = ("is_active",)
    search_fields = ("pet__pet_name",)
