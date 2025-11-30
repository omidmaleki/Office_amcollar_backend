from django.contrib import admin
from .models import Basket, BasketLine, PurchasedCourse

class BasketLineAdmin(admin.TabularInline):
    model = BasketLine
    extra = 1

class BasketAdmin(admin.ModelAdmin):
    inlines = [BasketLineAdmin]
    list_display = ['user', 'created_time']

class PurchasedCourseAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'purchase_date','ref_id']
    list_filter = ['user', 'course', 'purchase_date','ref_id']
    search_fields = ['user__username', 'course__title','ref_id']

admin.site.register(Basket, BasketAdmin)
admin.site.register(PurchasedCourse, PurchasedCourseAdmin)

