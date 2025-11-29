from rest_framework.views import APIView
from rest_framework.response import Response
import requests

OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"

class OwnerProxy(APIView):
    def get(self, request):
        resp = requests.get(f"{OWNER_SERVICE}/owners/")
        return Response(resp.json())

    def post(self, request):
        resp = requests.post(f"{OWNER_SERVICE}/owners/", json=request.data)
        try:
            data = resp.json()
        except ValueError:
            data = {"detail": "No content returned from Owner service."}
        return Response(data, status=resp.status_code)

class PetProxy(APIView):
    def get(self, request):
        resp = requests.get(f"{PET_SERVICE}/pets/")
        return Response(resp.json())