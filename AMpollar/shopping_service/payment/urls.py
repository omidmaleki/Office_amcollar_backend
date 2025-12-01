from django.urls import path
from .views import go_to_gateway_view


urlpatterns = [
    path('go_to_gateway/', go_to_gateway_view, name='go_to_gateway'),
]