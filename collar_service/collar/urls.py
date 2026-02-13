from rest_framework.routers import DefaultRouter
from .views import CollarViewSet, WifiCollarStatusViewSet
from django.urls import path, include

router = DefaultRouter()
router.register("collars", CollarViewSet, basename="collar")
router.register("collars_status", WifiCollarStatusViewSet, basename="wifi-collar-status")

urlpatterns = [
    path("", include(router.urls)),  # مسیرهای پیش‌فرض برای تمام ویوست‌ها
]
