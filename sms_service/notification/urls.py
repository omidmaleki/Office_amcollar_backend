# notification/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VeterinaryViewSet, ContactUsViewSet

router = DefaultRouter()
router.register(r'veterinary', VeterinaryViewSet)
router.register(r'contactus', ContactUsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


