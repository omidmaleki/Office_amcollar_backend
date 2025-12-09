from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, health, PetInfo2View

router = DefaultRouter()
router.register(r'pets', PetViewSet, basename='pet')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health, name='health'),
    path('pets/info2/<int:owner_id>/', PetInfo2View.as_view(), name='pet_info2'),
]
