# gyro/admin.py
from django.contrib import admin
from .models import Gyro

@admin.register(Gyro)
class GyroAdmin(admin.ModelAdmin):
    list_display = ('id', 'collar', 'pet', 'timestamp', 'created_at')
    list_filter = ('timestamp',)
    search_fields = ('collar__id', 'pet__pet_name')
