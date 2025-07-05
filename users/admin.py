# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
#---------------------------------------------------------------------
@admin.register(User)                                                       # Decorator from register

class UserAdmin(BaseUserAdmin):                                             # Creating Customized Panel for Users

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role', 'phone_number')}),                # Adding role and phone_number to admin form
                                          )

    list_display  = ('username', 'email', 'role', 'phone_number', 'is_staff', 'is_active')
    list_filter   = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'phone_number')
