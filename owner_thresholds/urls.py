# owner_thresholds/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.OwnerThresholdListCreateView.as_view(), name='ownerthreshold-list-create'),
    path('<int:pk>/', views.OwnerThresholdRetrieveUpdateDeleteView.as_view(), name='ownerthreshold-detail'),
]
