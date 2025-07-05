# battery/admin.py
from django.contrib import admin
from .models import Battery

@admin.register(Battery)
class BatteryAdmin(admin.ModelAdmin):
    list_display = (
        'battery_serial', 'collar', 'battery_level',
        'capacity_mah', 'voltage', 'is_active', 'installed_date', 'replaced_date', 'created_at'
    )
    list_filter = ('is_active', 'installed_date', 'replaced_date')
    search_fields = ('battery_serial', 'collar__id')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
