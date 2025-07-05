# vitalsigns/admin.py
from django.contrib import admin
from .models import VitalSigns

@admin.register(VitalSigns)
class VitalSignsAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'collar', 'vs_heart_rate', 'vs_spo2', 'vs_timestamp')
    search_fields = ('pet__pet_name', 'collar__id')
