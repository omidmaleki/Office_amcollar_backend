# system_thresholds/admin.py
from django.contrib import admin
from .models import SystemThreshold

@admin.register(SystemThreshold)
class SystemThresholdsAdmin(admin.ModelAdmin):
    llist_display = ('id', 'category', 'daily_calories', 'daily_water_ml', 'daily_food_grams', 'created_at')
    search_fields = ('sys_thrsh_pet_id',)
    ordering = ('-created_at',)
