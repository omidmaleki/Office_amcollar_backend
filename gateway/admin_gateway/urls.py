from django.urls import path, re_path
from revproxy.views import ProxyView
from .views import LoginView, DashboardView
from django.conf import settings

app_name = "admin_gateway"

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),

    # Proxy paths برای هر سرویس
    re_path(r'^proxy/vet/(?P<path>.*)$', ProxyView.as_view(upstream=settings.VET_SERVICE), name='proxy_vet'),
    re_path(r'^proxy/owner/(?P<path>.*)$', ProxyView.as_view(upstream=settings.OWNER_SERVICE), name='proxy_owner'),
    re_path(r'^proxy/pet/(?P<path>.*)$', ProxyView.as_view(upstream=settings.PET_SERVICE), name='proxy_pet'),
    re_path(r'^proxy/collar/(?P<path>.*)$', ProxyView.as_view(upstream=settings.COLLAR_SERVICE), name='proxy_collar'),
    re_path(r'^proxy/sale/(?P<path>.*)$', ProxyView.as_view(upstream=settings.SALE_SERVICE), name='proxy_sale'),
    re_path(r'^proxy/sms/(?P<path>.*)$', ProxyView.as_view(upstream=settings.SMS_SERVICE), name='proxy_sms'),
    re_path(r'^proxy/auth/(?P<path>.*)$', ProxyView.as_view(upstream=settings.AUTH_SERVICE), name='proxy_auth'),
    re_path(r'^proxy/threshold/(?P<path>.*)$', ProxyView.as_view(upstream=settings.THRESHOLD_SERVICE),
            name='proxy_threshold'),
]
