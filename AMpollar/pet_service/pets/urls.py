from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, ThresholdViewSet

router = DefaultRouter()
router.register(r'pets', PetViewSet, basename='pet')
router.register(r'thresholds', ThresholdViewSet, basename='threshold')

urlpatterns = [
    path('', include(router.urls)),
]
