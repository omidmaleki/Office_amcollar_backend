from django.contrib import admin
from django.urls import path

from .views import OwnerProxy, PetProxy

urlpatterns = [
    path('admin/', admin.site.urls),
    path('owners/', OwnerProxy.as_view(), name='owner-proxy'),
    path('pets/', PetProxy.as_view(), name='pet-proxy'),
]