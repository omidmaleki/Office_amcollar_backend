# gps/admin.py
from django.contrib import admin
from .models import GPS

@admin.register(GPS)
class GPSAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'collar', 'gps_lat', 'gps_lon', 'gps_timestamp', 'gps_valid', 'created_at')
    list_filter = ('gps_valid', 'created_at')
    search_fields = ('pet__name', 'collar__id', 'gps_lat', 'gps_lon')
