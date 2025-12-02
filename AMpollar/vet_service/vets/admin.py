from django.contrib import admin
from .models import VetForm, Vet

@admin.register(VetForm)
class VetFormAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner_id', 'pet_id', 'purchase_id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('owner_id', 'pet_id', 'purchase_id')


@admin.register(Vet)
class VetAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'vet_license_number', 'activated', 'created_at')
    list_filter = ('activated',)
    search_fields = ('name', 'phone', 'vet_license_number')
