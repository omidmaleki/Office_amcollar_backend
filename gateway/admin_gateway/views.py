from django.shortcuts import render, redirect
from django.views import View
from django.conf import settings

class LoginView(View):
    def get(self, request):
        return render(request, "admin_gateway/login.html")

    def post(self, request):
        print("=== CSRF DEBUG ===")
        print("CSRF Token from POST:", request.POST.get('csrfmiddlewaretoken'))
        print("CSRF Cookie:", request.COOKIES.get('csrftoken'))
        print("Referer:", request.META.get('HTTP_REFERER'))
        print("Origin:", request.META.get('HTTP_ORIGIN'))
        print("Host:", request.get_host())
        print("Scheme:", request.scheme)
        print("==================")

        username = request.POST.get("username")
        password = request.POST.get("password")
        if username == "admin" and password == "admin123":
            request.session['logged_in'] = True
            return redirect("admin_gateway:dashboard")  # تغییر: namespace + name درست
        return render(request, "admin_gateway/login.html", {"error": "Invalid credentials"})


class DashboardView(View):
    def get(self, request):
        if not request.session.get("logged_in"):
            return redirect("admin_gateway:login")

        # لود همه سرویس‌ها از settings
        services = [
            {
                "name": service_name.capitalize(),  # Vet -> Vet
                "url": service_url + "/admin/",  # internal URL + /admin/
                "proxy_path": f"/proxy/{service_name}/admin/"  # برای لینک در HTML (proxy از gateway)
            }
            for service_name, service_url in settings.SERVICES.items()
        ]

        return render(request, "admin_gateway/dashboard.html", {"services": services})