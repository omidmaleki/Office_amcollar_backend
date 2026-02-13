from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "color_product", "color_container", "size", "created_at")
    list_filter = ("color_product", "color_container", "size", "created_at")
    search_fields = ("name", "description")

