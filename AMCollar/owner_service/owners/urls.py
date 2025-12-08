from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OwnerViewSet, SendOtpView

router = DefaultRouter()
router.register(r'owners', OwnerViewSet, basename='owner')

urlpatterns = [
    path('', include(router.urls)),
    path("send-otp/", SendOtpView.as_view()),
]
