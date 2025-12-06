from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VetViewSet, VetFormViewSet, VetInfoMedicalViewSet, VetRegisterView

# -------------------- Router برای بقیه ViewSet ها --------------------
router = DefaultRouter()
router.register(r'vets', VetViewSet)
router.register(r'vet-forms', VetFormViewSet)
router.register(r'medical-info', VetInfoMedicalViewSet, basename='medical-info')

# -------------------- مسیر مستقیم برای Register --------------------
urlpatterns = [
    path("vets/register/", VetRegisterView.as_view(), name="vet-register"),
]

# اضافه کردن بقیه مسیرهای router
urlpatterns += router.urls
