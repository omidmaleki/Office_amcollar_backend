# Temperature/admin.py
from django.contrib import admin
from .models import Temperature

@admin.register(Temperature)
class TemperatureAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'collar', 'temp_value', 'temp_timestamp')
    search_fields = ('pet__pet_name', 'collar__id')
