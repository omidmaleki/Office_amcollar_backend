from django.contrib import admin
from django.urls import path, include
#---------------------------------------------------------------------
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/pets/', include('pet.urls')),
    path('api/collars/', include('collar.urls')),
    path('api/batteries/', include('battery.urls')),
    path('api/temperature/', include('temperature.urls')),
    path('api/vitalsigns/', include('vitalsigns.urls')),
    path('api/alerts/', include('alerts.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/device-info/', include('device_information.urls')),
    path('api/gps/', include('gps.urls')),
    path('api/gyro/', include('gyro.urls')),
    path('api/geofence/', include('geofence.urls')),
    path('api/owner_thresholds/', include('owner_thresholds.urls')),
    path('api/vet_thresholds/', include('vet_thresholds.urls')),
    path('api/system_thresholds/', include('system_thresholds.urls')),
    path('api/activity_tracker/', include('activity_tracker.urls')),
    path('api/stresspain/', include('stress_pain.urls')),
    path('api/water_food/', include('water_food.urls')),
]
