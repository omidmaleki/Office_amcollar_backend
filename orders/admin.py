# orders/admin.py
from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'vet', 'collar', 'status', 'created_at', 'paid_at')
    list_filter = ('status', 'created_at')
    search_fields = ('owner__username', 'vet__username', 'collar__serial_number')
