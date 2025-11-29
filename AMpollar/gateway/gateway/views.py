from django.views import View
import requests
import json
from django.http import JsonResponse

OWNER_SERVICE = "http://owner:8000"


class OwnerProxy(View):
    def get(self, request):
        resp = requests.get(f"{OWNER_SERVICE}/owners/")
        return JsonResponse(resp.json())