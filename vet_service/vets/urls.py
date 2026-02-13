from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VetViewSet,
    VetFormViewSet,
    VetInfoMedicalViewSet,
    VetRegisterView,
    CreateVetFormFromPet
)

router = DefaultRouter()

# مسیر دامپزشک‌ها
router.register(r'vets', VetViewSet, basename='vets')

# مسیر فرم‌ها
router.register(r'vet-forms', VetFormViewSet, basename='vet-forms')

# مسیر اطلاعات پزشکی
router.register(r'medical-info', VetInfoMedicalViewSet, basename='medical-info')

urlpatterns = [
    path("vets/register/", VetRegisterView.as_view(), name="vet-register"),
    path("vet-forms/from-pet/<int:pet_id>/", CreateVetFormFromPet.as_view()),

    # مسیرهای ViewSet → در ریشه
    path("", include(router.urls)),
]
