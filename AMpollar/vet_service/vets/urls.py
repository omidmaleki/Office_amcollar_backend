from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VetViewSet, VetFormViewSet, VetInfoMedicalViewSet, VetRegisterView, CreateVetFormFromPet

router = DefaultRouter()
router.register(r'vets', VetViewSet)
router.register(r'vet-forms', VetFormViewSet)
router.register(r'medical-info', VetInfoMedicalViewSet, basename='medical-info')

urlpatterns = [
    path("vets/register/", VetRegisterView.as_view(), name="vet-register"),
    path("", include(router.urls)),  # فقط این کافی است
]
