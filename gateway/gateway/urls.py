from django.contrib import admin
from django.urls import path, re_path
from .views import (
    OwnerProxy, PetProxy, CollarProxy, OrderProxy,
    sms_proxy, auth_proxy,WifiCollarStatusProxy,
    VetRegisterProxy, RegisterOwnerPetInfoView, VetFormsProxy,
    MedicalInfoProxy, ThresholdProxy, PaymentProxy, ThresholdDetailProxy, PetInfo2Proxy, VetListProxy, ContactusProxy,
    VeterinaryProxy
)
urlpatterns = [

    path("admin/", admin.site.urls),

    # Owner service
    path("owners/", OwnerProxy.as_view()),

    # Pet service
    path('pets/info2/<int:owner_id>/', PetInfo2Proxy.as_view(), name='pet_info2_proxy'),
    path("pets/", PetProxy.as_view()),

    # threshold service
    path("thresholds/", ThresholdProxy.as_view()),

    # gps
    # path('locations/', include('locations.urls')),

    # Collars service
    path("collars/status/", WifiCollarStatusProxy.as_view(), name="wifi_collar_status_proxy"),
    path("collars/", CollarProxy.as_view()),

    # Order service
    path('payments/create/', PaymentProxy.as_view(), name='proxy-create-payment'),
    path("orders/", OrderProxy.as_view(), name="proxy-orders"),


    # Payment service
    # path("payments/", PaymentProxy.as_view()),

    # SMS service
    path("sms/", sms_proxy),
    path("notification/contactus/", ContactusProxy.as_view()),
    path("notification/veterinary/", VeterinaryProxy.as_view()),

    # Auth - dynamic
    re_path(r"^auth/(?P<path>.*)$", auth_proxy),

    # Vet
    path("vet/vets/", VetListProxy.as_view()),
    path("vet/vets/register/", VetRegisterProxy.as_view()),
    path("vet/vet-forms/", VetFormsProxy.as_view()),
    path("vet/medical-info/", MedicalInfoProxy.as_view()),
    path("vet/vet-forms/<int:pk>/", VetFormsProxy.as_view(), name="vetform-detail"),
    # path("vet/", VetRegisterProxy.as_view()),

    path("thresholds/", ThresholdProxy.as_view(), name="gw_thresholds"),
    path("thresholds/<int:pk>/", ThresholdDetailProxy.as_view(), name="gw_threshold_detail"),


    # Register owner + pet (combined)
    path("register/", RegisterOwnerPetInfoView.as_view()),
]

