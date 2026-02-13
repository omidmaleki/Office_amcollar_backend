from django.contrib import admin
from .models import VetForm, Vet

@admin.register(VetForm)
class VetFormAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner_id', 'pet_name', 'status', 'created_at')  # pet_name رو اضافه کردم برای readability (pet_id Integer هست و کمکی نمی‌کنه)
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'pet_name', 'status')  # search روی string fields بهتره؛ owner_id/pet_id رو حذف کردم چون Integer search کند/خطادار می‌شه
    readonly_fields = ('created_at', 'updated_at')  # برای جلوگیری از edit accidental

    # اگر ForeignKey vet issue می‌ده، raw_id_fields اضافه کن (برای large FK):
    # raw_id_fields = ('vet',)

@admin.register(Vet)
class VetAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'vet_license_number', 'activated', 'created_at')
    list_filter = ('activated', 'rank', 'created_at')  # rank رو اضافه کردم
    search_fields = ('name', 'phone', 'vet_license_number')  # عالی، string fields
    list_editable = ('activated',)  # اختیاری: inline edit