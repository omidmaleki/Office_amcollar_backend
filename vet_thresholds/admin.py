# vet_thresholds/admin.py
from django.contrib import admin
from .models import VetThreshold

@admin.register(VetThreshold)
class VetThresholdAdmin(admin.ModelAdmin):
    list_display = ('vet', 'pet', 'collar', 'temp_min', 'temp_max', 'hr_min', 'hr_max', 'thresholds_updated', 'created_at')
    list_filter = ('vet',)
    search_fields = ('vet__username', 'pet__name', 'collar__serial_number')
