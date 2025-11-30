from django.contrib import admin
from django.urls import path

from .views import OwnerProxy, PetProxy, sms_proxy, RegisterOwnerPetInfo1ViewSet, ShoppingProxy

urlpatterns = [
    path('admin/', admin.site.urls),
    path('owners/', OwnerProxy.as_view(), name='owner-proxy'),
    path('pets/', PetProxy.as_view(), name='pet-proxy'),
    path('shopping', ShoppingProxy.as_view(), name='shopping'),

    path("sms/", sms_proxy),
    path("register/", RegisterOwnerPetInfo1ViewSet.as_view()),
]