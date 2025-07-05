# system_thresholds/urls.py
from django.urls import path
from .views import PetCategoryListCreateView, SystemThresholdListCreateView

urlpatterns = [
    path('categories/', PetCategoryListCreateView.as_view(), name='petcategory-list-create'),
    path('thresholds/', SystemThresholdListCreateView.as_view(), name='systemthreshold-list-create'),
]
