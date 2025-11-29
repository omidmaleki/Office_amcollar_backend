from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"
SMS_SERVICE = "http://sms:8000"

def parse_body(request):
    if not request.body:
        return {}
    return json.loads(request.body.decode("utf-8"))

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

@csrf_exempt
def sms_proxy(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)

    try:
        body = parse_body(request)
        resp = requests.post(f"{SMS_SERVICE}/sms/", json=body)

        try:
            return JsonResponse(resp.json(), status=resp.status_code)
        except ValueError:
            return JsonResponse({"success": False, "message": "Invalid JSON from SMS service"}, status=500)

    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
