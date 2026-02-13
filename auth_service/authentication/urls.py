from django.urls import path
from .views import (
    OwnerSendOtpView,
    OwnerVerifyOtpView,
    VetSendOtpView,
    VetVerifyOtpView,
    AssignRoleView,
)

urlpatterns = [
    path("owners/send-otp/", OwnerSendOtpView.as_view()),
    path("owners/verify-otp/", OwnerVerifyOtpView.as_view()),

    path("vets/send-otp/", VetSendOtpView.as_view()),
    path("vets/verify-otp/", VetVerifyOtpView.as_view()),

    path("assign-role/", AssignRoleView.as_view()),
]
