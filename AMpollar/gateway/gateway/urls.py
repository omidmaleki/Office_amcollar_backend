from django.contrib import admin
from django.urls import path

from .views import OwnerProxy


urlpatterns = [
    path('admin/', admin.site.urls),
    path("owners/", OwnerProxy.as_view()),
]