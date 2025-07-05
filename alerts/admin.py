# alerts/admin.py
from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'collar', 'alert_type', 'alert_level', 'alert_timestamp', 'alert_resolved')
    list_filter = ('alert_type', 'alert_level', 'alert_resolved')
    search_fields = ('alert_message', 'pet__pet_name', 'collar__collar_serial')
