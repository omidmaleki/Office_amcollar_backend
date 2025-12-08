from django.urls import path
from .views import SingleProductView

urlpatterns = [
    path("collar/", SingleProductView.as_view(), name="single-collar"),
]
