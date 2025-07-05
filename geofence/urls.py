# geofence/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.GeoFenceListCreateView.as_view(), name='geofence-list-create'),
    path('<int:pk>/', views.GeoFenceRetrieveUpdateDeleteView.as_view(), name='geofence-detail'),
]
