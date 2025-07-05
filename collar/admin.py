# collar/admin.py
from django.contrib import admin
from .models import Collar

@admin.register(Collar)
class CollarAdmin(admin.ModelAdmin):
    list_display = ('id', 'serial_number', 'owner', 'assigned_pet', 'is_active', 'firmware_version', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('serial_number', 'owner__username', 'assigned_pet__pet_name')
