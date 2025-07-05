# device_information/admin.py
from django.contrib import admin
from .models import DeviceInformation

@admin.register(DeviceInformation)
class DeviceInformationAdmin(admin.ModelAdmin):
    list_display = ('device_id', 'collar', 'pet', 'is_online', 'last_sync_time')
    list_filter = ('is_online', 'gps_on', 'vibration_on', 'notifications_enabled')
    search_fields = ('device_id',)
