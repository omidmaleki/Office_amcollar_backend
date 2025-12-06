from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import time

# ---------------------- SERVICE URLs ----------------------
OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"
COLLAR_SERVICE = "http://collar:8000"
ORDER_SERVICE = "http://order:8000"
PAYMENT_SERVICE = "http://payment:8000"
NOTIFICATION_SERVICE = "http://notification:8000"
SMS_SERVICE = "http://sms:8000"
AUTH_SERVICE = "http://auth:8000"
VET_SERVICE = "http://vet:8000"


# ---------------------- GENERIC PROXY CLASS ----------------------
class BaseProxy(APIView):
    SERVICE_URL = None

    def get(self, request):
        resp = requests.get(f"{self.SERVICE_URL}", params=request.query_params)
        return Response(resp.json(), status=resp.status_code)

    def post(self, request):
        resp = requests.post(f"{self.SERVICE_URL}", json=request.data)
        return Response(resp.json(), status=resp.status_code)


# ---------------------- SPECIFIC PROXIES ----------------------
class OwnerProxy(BaseProxy):
    SERVICE_URL = f"{OWNER_SERVICE}/owners/"


class PetProxy(BaseProxy):
    SERVICE_URL = f"{PET_SERVICE}/pets/"


class CollarProxy(BaseProxy):
    SERVICE_URL = f"{COLLAR_SERVICE}/products/"


class OrderProxy(BaseProxy):
    def get(self, request):
        try:
            # 1) دریافت لیست سفارش‌ها
            orders_res = requests.get(f"{ORDER_SERVICE}/orders/")
            orders = orders_res.json()

            result = []

            for o in orders:
                owner_id = o["owner_id"]
                collar_id = o["collar_id"]

                # 2) دریافت صاحب
                owner = requests.get(f"{OWNER_SERVICE}/owners/{owner_id}/").json()

                # 3) پیدا کردن pet از روی owner_id + collar_id
                pets = requests.get(f"{PET_SERVICE}/pets/", params={"owner_id": owner_id}).json()

                pet = next(
                    (p for p in pets if str(p.get("collar_id")) == str(collar_id)),
                    None
                )

                if not pet:
                    return Response({"error": f"pet not found for owner={owner_id}, collar={collar_id}"}, status=404)

                result.append({
                    "order_id": o["id"],
                    "status": o["status"],
                    "pet_name": pet["name"],
                    "owner_name": owner["name"],
                    "owner_phone": owner["phone"],
                    "collar_id": pet["collar_id"],
                    "pet_id": pet["id"],
                    "vet_id": o["vet_id"],
                    "created_at": o["created_at"]
                })

            return Response(result)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class PaymentProxy(BaseProxy):
    SERVICE_URL = f"{PAYMENT_SERVICE}/payments/"


class NotificationProxy(BaseProxy):
    SERVICE_URL = f"{NOTIFICATION_SERVICE}/notifications/"


# class VetProxy(APIView):
#     SERVICE_URL = VET_SERVICE   # http://vet:8000
#
#     def _forward(self, request, method, path):
#         url = f"{self.SERVICE_URL}/{path}".rstrip("/")
#
#         resp = requests.request(
#             method=method,
#             url=url,
#             params=request.query_params,
#             json=request.data if method in ("POST","PUT","PATCH") else None,
#             headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
#             timeout=20
#         )
#
#         try:
#             return Response(resp.json(), status=resp.status_code)
#         except ValueError:
#             return Response(resp.text, status=resp.status_code)
#
#     def get(self, request, path="", *args, **kwargs):
#         return self._forward(request, "GET", path)
#
#     def post(self, request, path="", *args, **kwargs):
#         return self._forward(request, "POST", path)
#
#     def put(self, request, path="", *args, **kwargs):
#         return self._forward(request, "PUT", path)
#
#     def patch(self, request, path="", *args, **kwargs):
#         return self._forward(request, "PATCH", path)
#
#     def delete(self, request, path="", *args, **kwargs):
#         return self._forward(request, "DELETE", path)

class VetRegisterProxy(APIView):
    def post(self, request):
        url = f"{VET_SERVICE}/vets/register/"
        for i in range(5):
            try:
                resp = requests.post(url, json=request.data, timeout=5)
                break
            except requests.exceptions.ConnectionError:
                time.sleep(2)
        else:
            return Response({"detail": "vet service unavailable"}, status=503)

        try:
            data = resp.json()
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)


class VetFormsProxy(APIView):
    """
    Proxy: Forward requests to Vet Forms service
    """
    def get(self, request):
        url = f"{VET_SERVICE}/vet-forms/"
        try:
            resp = requests.get(url, params=request.query_params, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)

    def post(self, request):
        url = f"{VET_SERVICE}/vet-forms/"
        try:
            resp = requests.post(url, json=request.data, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)

class MedicalInfoProxy(APIView):
    """
    Proxy: Forward requests to Vet Medical Info service
    """
    def get(self, request):
        url = f"{VET_SERVICE}/medical-info/"
        try:
            resp = requests.get(url, params=request.query_params, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)

    def post(self, request):
        url = f"{VET_SERVICE}/medical-info/"
        try:
            resp = requests.post(url, json=request.data, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)
# ---------------------- AUTH Proxy ----------------------
@api_view(["POST"])
def auth_proxy(request, path):
    """
    ANY request to /auth/<path>/ goes to auth service
    Example:
        /auth/owners/send-otp/
        /auth/vets/login/
    """
    url = f"{AUTH_SERVICE}/auth/{path}/"

    try:
        resp = requests.post(url, json=request.data)
        return Response(resp.json(), status=resp.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ---------------------- SMS Proxy ----------------------
@api_view(["POST"])
def sms_proxy(request):
    try:
        resp = requests.post(f"{SMS_SERVICE}/sms/", json=request.data)
        return Response(resp.json(), status=resp.status_code)
    except Exception as e:
        return Response({"success": False, "message": str(e)}, status=500)


# ---------------------- Combined Register Endpoint ----------------------
class RegisterOwnerPetInfoView(APIView):
    def post(self, request):
        try:
            data = request.data
            owner_data = data.get("owner")
            pet_data = data.get("pet")
            vet_id = data.get("vet")

            if not owner_data or not pet_data:
                return Response({"detail": "owner + pet required"}, status=400)

            # ---------------- Create Owner ----------------
            owner_payload = {
                "name": owner_data.get("name"),
                "phone": owner_data.get("phone"),
                "address": owner_data.get("address", ""),
                "vet_id": vet_id,
                "pet_ids": [],
                "collar_ids": {}
            }

            owner_res = requests.post(f"{OWNER_SERVICE}/owners/", json=owner_payload)
            owner_json = owner_res.json()
            owner_id = owner_json.get("id")

            # ---------------- Create Pet ----------------
            pet_payload = {
                "name": pet_data.get("name"),
                "species": pet_data.get("species"),
                "owner_id": owner_id
            }

            pet_res = requests.post(f"{PET_SERVICE}/pets/", json=pet_payload)
            pet_json = pet_res.json()
            pet_id = pet_json.get("id")

            # ---------------- Assign Collar ID = pet_id ----------------
            collar_id = pet_id  # 👈 مهم

            requests.patch(
                f"{PET_SERVICE}/pets/{pet_id}/",
                json={"collar_id": collar_id}
            )

            # ---------------- Update Owner ----------------
            owner_update_payload = {
                "pet_ids": [pet_id],
                "collar_ids": {str(pet_id): pet_data.get("name")}
            }

            owner_update_res = requests.patch(
                f"{OWNER_SERVICE}/owners/{owner_id}/",
                json=owner_update_payload
            )

            return Response({
                "owner": owner_update_res.json(),
                "pet": {**pet_json, "collar_id": collar_id},
                "vet": {"id": vet_id}
            }, status=200)

        except Exception as e:
            return Response({"detail": str(e)}, status=500)
