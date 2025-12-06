from django.contrib import admin
from django.urls import path, re_path
from .views import (
    OwnerProxy, PetProxy, CollarProxy, OrderProxy,
    PaymentProxy, NotificationProxy, sms_proxy, auth_proxy,
    VetRegisterProxy, RegisterOwnerPetInfoView, VetFormsProxy,
    MedicalInfoProxy, ThresholdProxy
)

urlpatterns = [

    path("admin/", admin.site.urls),

    # Owner service
    path("owners/", OwnerProxy.as_view()),

    # Pet service
    path("pets/", PetProxy.as_view()),

    # threshold service
    path("thresholds/", ThresholdProxy.as_view()),

    # Product service
    path("collars/", CollarProxy.as_view()),

    # Order service
    path("orders/", OrderProxy.as_view()),


    # Payment service
    path("payments/", PaymentProxy.as_view()),

    # Notifications
    path("notifications/", NotificationProxy.as_view()),

    # SMS service
    path("sms/", sms_proxy),

    # Auth - dynamic
    re_path(r"^auth/(?P<path>.*)$", auth_proxy),

    # Vet
    # path("vet/", VetRegisterProxy.as_view()),
    path("vet/vets/register/", VetRegisterProxy.as_view()),
    path("vet/vet-forms/", VetFormsProxy.as_view()),
    path("vet/medical-info/", MedicalInfoProxy.as_view()),

    # Register owner + pet (combined)
    path("register/", RegisterOwnerPetInfoView.as_view()),
]
