# pet/admin.py
from django.contrib import admin
from .models import Pet

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'species', 'owner', 'vet', 'age_months', 'created_at')
    search_fields = ('name', 'owner__username', 'vet__username')
    list_filter = ('species', 'gender', 'neutered')
