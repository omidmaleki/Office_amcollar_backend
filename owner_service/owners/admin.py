from django.contrib import admin
from .models import Owner
# Register your models here.

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'active')
    search_fields = ('name', 'phone')
    list_editable = ('active',)