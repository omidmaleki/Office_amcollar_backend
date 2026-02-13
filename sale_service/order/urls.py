from django.urls import path
from .views import ListOrdersView

urlpatterns = [
    path('', ListOrdersView.as_view()),
]
