# owner_thresholds/admin.py
from django.contrib import admin
from .models import OwnerThreshold

@admin.register(OwnerThreshold)
class OwnerThresholdAdmin(admin.ModelAdmin):
    list_display = ('owner', 'pet', 'collar', 'geofence_radius', 'created_at', 'updated_at')
    list_filter = ('owner',)
    search_fields = ('owner__username', 'pet__name', 'collar__id')
