# battery/urls.py
from django.urls import path
from .views import BatteryListCreateView, BatteryDetailView

urlpatterns = [
    path('', BatteryListCreateView.as_view(), name='battery-list-create'),
    path('<int:pk>/', BatteryDetailView.as_view(), name='battery-detail'),
]
