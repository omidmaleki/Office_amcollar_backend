from django.contrib import admin
from .models import Pet
# Register your models here.
@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "species",
        "sex",
        "age",
        "weight",
        "neutered",
        "owner_id",
        "vet_id",
        "collar_id",
        "created_at",
    )

    list_filter = (
        "species",
        "sex",
        "neutered",
        "created_at",
    )

    search_fields = (
        "name",
        "race",
        "owner_id",
        "vet_id",
        "collar_id",
    )

    readonly_fields = ("created_at",)