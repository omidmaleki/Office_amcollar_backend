# pet/urls.py
from django.urls import path
from .views import PetCreateView, PetListView

urlpatterns = [
    path('create/', PetCreateView.as_view(), name='pet-create'),
    path('list/', PetListView.as_view(), name='pet-list'),
]
