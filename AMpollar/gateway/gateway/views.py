from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from requests.exceptions import RequestException
import requests

OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"
SMS_SERVICE = "http://sms:8000"
SHOPPING_SERVICE = "http://shopping:8000"

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

class ShoppingProxy(APIView):
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


class RegisterOwnerPetInfo1ViewSet(APIView):
    def post(self, request):
        data = request.data
        owner_data = data["owner"]



        owner_check_res = requests.get(f"http://owner:8000/owners/?phone={owner_data['phone']}")
        existing_owners = owner_check_res.json()
        if existing_owners:
            return Response({
                "detail": "این شماره قبلاً ثبت شده است."
            }, status=409)

        pet_data = data["pet"]
        try:
            pet_res = requests.post("http://pet:8000/pets/", json=pet_data)
            pet_res.raise_for_status()
            pet_id = pet_res.json().get("id")
        except RequestException:
            return Response({"detail": "خطا در سرویس pet"}, status=500)

        owner_payload = {
            "name": owner_data["name"],
            "phone": owner_data["phone"],
            "address": owner_data.get("address", ""),
            "pet_id": pet_id
        }

        owner_res = requests.post("http://owner:8000/owners/", json=owner_payload)
        return Response({
            "pet": pet_res.json(),
            "owner": owner_res.json()
        })
