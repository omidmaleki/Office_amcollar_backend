from django.urls import path
from .views import SingleProductView

urlpatterns = [
    path("product/", SingleProductView.as_view(), name="single-product"),
]
