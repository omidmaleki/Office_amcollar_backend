# gps/urls.py
from django.urls import path
from .views import GPSCreateView, GPSListView

urlpatterns = [
    path('create/', GPSCreateView.as_view(), name='gps-create'),
    path('list/', GPSListView.as_view(), name='gps-list'),
]
