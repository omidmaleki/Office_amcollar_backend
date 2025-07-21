from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="AMCollar API",
      default_version='v1',
      description="Swagger documentation for AMCollar",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="your@email.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

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
    path('api/orders/', include('orders.urls')),

    # Swagger & ReDoc URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]
