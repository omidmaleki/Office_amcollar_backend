from django.contrib import admin
from django.urls import path

from .views import OwnerProxy, PetProxy, sms_proxy

urlpatterns = [
    path('admin/', admin.site.urls),
    path('owners/', OwnerProxy.as_view(), name='owner-proxy'),
    path('pets/', PetProxy.as_view(), name='pet-proxy'),
    # path('auth/', AuthProxy.as_view(), name="auth-proxy"),
    path("sms/", sms_proxy),
]