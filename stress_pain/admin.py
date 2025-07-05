# stress_pain/admin.py
from django.contrib import admin
from .models import StressPainRecord

@admin.register(StressPainRecord)
class StressPainRecordAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'pet', 'collar', 'timestamp', 'heart_rate', 'hrv', 'spo2',
        'body_temperature_celsius', 'stress_level', 'created_at'
    )
    search_fields = ('pet__name', 'collar__serial_number')
    list_filter = ('stress_level', 'timestamp')
    ordering = ('-timestamp',)
