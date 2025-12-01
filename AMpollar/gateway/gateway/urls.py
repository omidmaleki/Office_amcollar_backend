from django.contrib import admin
from django.urls import path
from .views import (
    OwnerProxy, PetProxy, RegisterOwnerPetInfo1ViewSet,
    ShoppingProxy, sms_proxy, auth_proxy,
# verify_otp_proxy, send_otp_proxy
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Owner proxy
    path('owners/', OwnerProxy.as_view(), name='owner-proxy'),

    # Pet proxy
    path('pets/', PetProxy.as_view(), name='pet-proxy'),

    # Shopping proxy
    path('shopping/', ShoppingProxy.as_view(), name='shopping'),

    # SMS
    path('sms/', sms_proxy, name='sms_send_proxy'),

    # Send OTP
    # path('auth/owners/send-otp/', send_otp_proxy, name='send_otp_proxy'),
    # path("auth/owners/verify-otp/", verify_otp_proxy, name="verify_otp_proxy"),
    #
    # path('auth/vets/send-otp/', send_otp_proxy, name='send_otp_proxy'),
    # path("auth/vets/verify-otp/", verify_otp_proxy, name="verify_otp_proxy"),

    path("auth/<path:path>/", auth_proxy),


    # Register owner & pet
    path('register/', RegisterOwnerPetInfo1ViewSet.as_view(), name='register_owner_pet')
]
