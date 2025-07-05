# activity_tracker/admin.py
from django.contrib import admin
from .models import ActivityRecord

@admin.register(ActivityRecord)
class ActivityRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'collar', 'date', 'sleep_duration_minutes', 'calories_burned', 'walk_duration_minutes')
    search_fields = ('pet__name', 'collar__serial_number')
    list_filter = ('date',)
