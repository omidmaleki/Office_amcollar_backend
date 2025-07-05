# water_food/admin.py
from django.contrib import admin
from .models import WaterFoodContainer, WaterFoodRecord

@admin.register(WaterFoodContainer)
class WaterFoodContainerAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'collar', 'description', 'created_at')
    search_fields = ('pet__name', 'collar__serial_number')
    list_filter = ('created_at',)

@admin.register(WaterFoodRecord)
class WaterFoodRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'container', 'timestamp', 'water_weight_grams', 'food_weight_grams', 'created_at')
    search_fields = ('container__pet__name',)
    list_filter = ('timestamp',)
    ordering = ('-timestamp',)
