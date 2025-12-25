from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import time
from rest_framework import status
import logging
import os
import json
from kafka import KafkaProducer  # برای SMS events
# ---------------------- SERVICE URLs ----------------------
OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"
COLLAR_SERVICE = "http://collar:8000"
SALE_SERVICE = "http://sale:8000"
SMS_SERVICE = "http://sms:8000"
AUTH_SERVICE = "http://auth:8000"
VET_SERVICE = "http://vet:8000"
THRESHOLD_SERVICE = "http://threshold:8000"


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

class PetInfo2Proxy(APIView):
    """
    پراکسی برای PATCH /pets/secondary-update/<owner_id>/
    """

    def get(self, request, owner_id):
        try:
            url = f"{PET_SERVICE}/pets/info2/{owner_id}/"
            resp = requests.get(url, timeout=5)
            return Response(resp.json(), status=resp.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"detail": f"Pet service unreachable: {str(e)}"},
                status=503
            )

    def patch(self, request, owner_id):
        try:
            url = f"{PET_SERVICE}/pets/info2/{owner_id}/"
            resp = requests.patch(url, json=request.data, timeout=5)
            return Response(resp.json(), status=resp.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"detail": f"Pet service unreachable: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

class CollarProxy(BaseProxy):
    SERVICE_URL = f"{COLLAR_SERVICE}/collars/"

class WifiCollarStatusProxy(APIView):
    """
    پراکسی برای /collars/status/
    """
    SERVICE_URL = f"{COLLAR_SERVICE}/collars_status/"

    def get(self, request):
        try:
            resp = requests.get(self.SERVICE_URL, params=request.query_params, timeout=5)
            return Response(resp.json(), status=resp.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"detail": f"Collar service unreachable: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    def post(self, request):
        try:
            resp = requests.post(self.SERVICE_URL, json=request.data, timeout=5)
            return Response(resp.json(), status=resp.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"detail": f"Collar service unreachable: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    def patch(self, request):
        try:
            resp = requests.patch(self.SERVICE_URL, json=request.data, timeout=5)
            return Response(resp.json(), status=resp.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"detail": f"Collar service unreachable: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class PaymentProxy(APIView):
    def post(self, request):
        data = request.data
        required_fields = ["owner_id", "collar_id", "vet_id", "pet_id"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return Response({"error": f"Missing fields: {missing}"}, status=400)

        try:
            res = requests.post(f"{SALE_SERVICE}/payments/create/", json=data, timeout=10)
            # بدون raise_for_status، فقط پاسخ Sale Service را Forward می‌کنیم
            return Response(res.json(), status=res.status_code)
        except requests.exceptions.RequestException as e:
            # اگر Sale Service در دسترس نباشد
            return Response({"error": f"Sale service unreachable: {str(e)}"}, status=503)


class OrderProxy(APIView):
    def get(self, request):
        try:
            # 1) دریافت لیست سفارش‌ها از Sale Service
            orders_res = requests.get(f"{SALE_SERVICE}/orders/")
            orders_res.raise_for_status()
            orders = orders_res.json()

            result = []

            for o in orders:
                owner_id = o["owner_id"]
                collar_id = o["collar_id"]

                # 2) دریافت اطلاعات owner
                owner_res = requests.get(f"{OWNER_SERVICE}/owners/{owner_id}/")
                owner_res.raise_for_status()
                owner = owner_res.json()

                # 3) دریافت pet بر اساس owner_id
                pets_res = requests.get(f"{PET_SERVICE}/pets/", params={"owner_id": owner_id})
                pets_res.raise_for_status()
                pets = pets_res.json()

                pet = next(
                    (p for p in pets if str(p.get("collar_id")) == str(collar_id)),
                    None
                )

                if not pet:
                    result.append({
                        "order_id": o["id"],
                        "error": f"No pet found for owner={owner_id}, collar={collar_id}"
                    })
                    continue

                result.append({
                    "order_id": o["id"],
                    "status": o["status"],
                    "pet_name": pet.get("name"),
                    "owner_name": owner.get("name"),
                    "owner_phone": owner.get("phone"),
                    "collar_id": pet.get("collar_id"),
                    "pet_id": pet.get("id"),
                    "vet_id": o.get("vet_id"),
                    "created_at": o.get("created_at"),
                })

            return Response(result)

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Service unreachable: {str(e)}"}, status=503)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class VetNewOrderProxyView(APIView):
    """
    Proxy برای نمایش سفارش‌های جدید به Vet
    """
    def get(self, request):
        try:
            # resp = requests.get(f"{ORDER_SERVICE}/vet-new-order/", timeout=5)
            resp = requests.get(f"{SALE_SERVICE}/vet-new-order/", timeout=5)
            resp.raise_for_status()
            return Response(resp.json())
        except Exception as e:
            return Response({"error": str(e)}, status=500)


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

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        url = f"{VET_SERVICE}/vet-forms/"
        if pk is not None:
            url += f"{pk}/"

        try:
            resp = requests.get(url, params=request.query_params, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)

    def post(self, request, *args, **kwargs):
        url = f"{VET_SERVICE}/vet-forms/"
        try:
            resp = requests.post(url, json=request.data, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)

    def put(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if not pk:
            return Response({"detail": "Missing pk for update"}, status=400)

        url = f"{VET_SERVICE}/vet-forms/{pk}/"
        try:
            resp = requests.put(url, json=request.data, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)

    def patch(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if not pk:
            return Response({"detail": "Missing pk for partial update"}, status=400)

        url = f"{VET_SERVICE}/vet-forms/{pk}/"
        try:
            resp = requests.patch(url, json=request.data, timeout=5)
            data = resp.json()
        except requests.exceptions.RequestException:
            return Response({"detail": "vet service unavailable"}, status=503)
        except ValueError:
            data = {"detail": resp.text}

        return Response(data, status=resp.status_code)


class ThresholdProxy(APIView):

    def get(self, request):
        try:
            res = requests.get(f"{VET_SERVICE}/thresholds/", params=request.query_params)
            return Response(res.json(), status=res.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=503)

    def post(self, request):
        try:
            res = requests.post(f"{VET_SERVICE}/thresholds/", json=request.data)
            return Response(res.json(), status=res.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=503)


class ThresholdDetailProxy(APIView):

    def get(self, request, pk):
        res = requests.get(f"{VET_SERVICE}/thresholds/{pk}/")
        return Response(res.json(), status=res.status_code)

    def patch(self, request, pk):
        res = requests.patch(f"{VET_SERVICE}/thresholds/{pk}/", json=request.data)
        return Response(res.json(), status=res.status_code)

    def delete(self, request, pk):
        res = requests.delete(f"{VET_SERVICE}/thresholds/{pk}/")
        return Response(status=res.status_code)



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


logger = logging.getLogger(__name__)  # **فیکس: logger درست import و init**

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

class RegisterOwnerPetInfoView(APIView):
    """
    Orchestrator برای ثبت همزمان Owner و Pet:
    1. Health check سرویس‌ها
    2. Create Owner
    3. Create Pet
    4. Update Owner با pet_id
    5. Rollback در خطا
    6. Send SMS events به Kafka در موفقیت
    """

    def post(self, request):
        data = request.data
        owner_data = data.get("owner")
        pet_data = data.get("pet")
        vet_id = data.get("vet")

        if not owner_data or not pet_data:
            logger.warning("[Gateway] Missing owner or pet data in request")  # **فیکس: msg اضافه**
            return Response({"detail": "owner and pet fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        created_owner_id = None
        created_pet_id = None

        # ------------------------ 0) Health check سرویس‌ها ------------------------
        try:
            for service_url in [OWNER_SERVICE, PET_SERVICE]:
                resp = requests.get(f"{service_url}/health/", timeout=3)
                if resp.status_code != 200:
                    logger.error(f"[Gateway] Service {service_url} unavailable (status {resp.status_code})")  # **فیکس: msg کامل**
                    return Response(
                        {"detail": f"Service {service_url} is unavailable"},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
        except requests.RequestException as e:
            logger.error(f"[Gateway] Network error checking services: {str(e)}")  # **فیکس: msg**
            return Response(
                {"detail": f"Network error checking services: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            # ------------------------ 1) Create Owner ------------------------
            owner_payload = {
                "name": owner_data.get("name"),
                "phone": owner_data.get("phone"),
                "address": owner_data.get("address", ""),
                "vet_id": vet_id,
                "pet_ids": [],
                "collar_ids": {}
            }
            owner_res = requests.post(f"{OWNER_SERVICE}/owners/", json=owner_payload, timeout=5)
            owner_res.raise_for_status()
            owner_json = owner_res.json()
            created_owner_id = owner_json.get("id")
            if not created_owner_id:
                logger.error("[Gateway] Owner service did not return id")  # **فیکس: msg**
                raise Exception("Owner service did not return id")

            # ------------------------ 2) Create Pet ------------------------
            pet_payload = {
                "name": pet_data.get("name"),
                "species": pet_data.get("species"),
                "sex": pet_data.get("sex"),
                "age": pet_data.get("age"),
                "race": pet_data.get("race"),
                "owner_id": created_owner_id,
                "vet_id": vet_id,
                "collar_id": 0
            }
            pet_res = requests.post(f"{PET_SERVICE}/pets/", json=pet_payload, timeout=5)
            pet_res.raise_for_status()
            pet_json = pet_res.json()
            created_pet_id = pet_json.get("id")
            if not created_pet_id:
                logger.error("[Gateway] Pet service did not return id")  # **فیکس: msg**
                raise Exception("Pet service did not return id")

            # ------------------------ 3) Update Owner با pet_id ------------------------
            owner_update_payload = {
                "pet_ids": [created_pet_id],
                "collar_ids": {}
            }
            owner_update_res = requests.patch(
                f"{OWNER_SERVICE}/owners/{created_owner_id}/",
                json=owner_update_payload,
                timeout=5
            )
            owner_update_res.raise_for_status()
            owner_updated_json = owner_update_res.json()

            # ------------------------ 4) Send SMS Events to Kafka (جدید: بعد از موفقیت) ------------------------
            try:
                self._send_registration_sms_events(created_owner_id, owner_json, support_mobile=os.getenv("SUPPORT_MOBILE", None))
                logger.info(f"[Gateway] SMS events sent for new owner {created_owner_id}")
            except Exception as sms_error:
                logger.error(f"[Gateway] Failed to send SMS events for owner {created_owner_id}: {str(sms_error)}")  # **فیکس: msg کامل**
                # ادامه بده – SMS fail crash نکن

            return Response({
                "owner": owner_updated_json,
                "pet": pet_json,
                "vet": {"id": vet_id}
            }, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            logger.error(f"[Gateway] Network error with microservices: {str(e)}")  # **فیکس: msg**
            # Rollback
            if created_pet_id:
                try:
                    requests.delete(f"{PET_SERVICE}/pets/{created_pet_id}/", timeout=5)
                    logger.info(f"[Gateway] Rolled back pet {created_pet_id}")
                except Exception as rollback_e:
                    logger.error(f"[Gateway] Rollback pet failed: {str(rollback_e)}")
            if created_owner_id:
                try:
                    requests.delete(f"{OWNER_SERVICE}/owners/{created_owner_id}/", timeout=5)
                    logger.info(f"[Gateway] Rolled back owner {created_owner_id}")
                except Exception as rollback_e:
                    logger.error(f"[Gateway] Rollback owner failed: {str(rollback_e)}")
            return Response({"detail": f"Network error communicating with microservices: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except Exception as e:
            logger.error(f"[Gateway] Internal error in registration: {str(e)}")  # **فیکس: msg**
            # Rollback
            if created_pet_id:
                try:
                    requests.delete(f"{PET_SERVICE}/pets/{created_pet_id}/", timeout=5)
                except:
                    pass
            if created_owner_id:
                try:
                    requests.delete(f"{OWNER_SERVICE}/owners/{created_owner_id}/", timeout=5)
                except:
                    pass
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _send_registration_sms_events(self, owner_id, owner_json, support_mobile=None):
        """
        ارسال event SMS برای owner جدید و support به Kafka.
        - Owner: welcome message
        - Support: "Owner جدید ثبت شد"
        """
        kafka_broker = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
        producer = KafkaProducer(
            bootstrap_servers=kafka_broker,
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )

        owner_mobile = owner_json.get("phone")
        owner_name = owner_json.get("name", "مشتری")

        if not owner_mobile:
            logger.warning(f"[Gateway] No phone for owner {owner_id}, skipping owner SMS")  # **فیکس: msg**
            return

        # Event برای Owner (welcome)
        owner_sms_event = {
            "event_type": "SEND_SMS",
            "event_version": 1,
            "owner_id": owner_id,
            "mobile": owner_mobile,
            "template": "WELCOME_OWNER",  # template جدید
            "params": {
                "owner_name": owner_name,
                "pet_ids": owner_json.get("pet_ids", []),
            },
        }
        producer.send(
            topic="vetform_topic",  # همون topic (یا "owner_topic" جدید)
            key=f"owner-welcome-{owner_id}".encode("utf-8"),
            value=owner_sms_event,
        )

        # Event برای Support (اگر mobile ست باشه)
        if support_mobile:
            support_sms_event = {
                "event_type": "SEND_SMS",
                "event_version": 1,
                "owner_id": owner_id,
                "mobile": support_mobile,
                "template": "SUPPORT_NEW_OWNER",  # template جدید
                "params": {
                    "owner_name": owner_name,
                    "owner_id": owner_id,
                    "phone": owner_mobile,
                },
            }
            producer.send(
                topic="vetform_topic",
                key=f"support-new-owner-{owner_id}".encode("utf-8"),
                value=support_sms_event,
            )
            logger.info(f"[Gateway] Support SMS event sent for owner {owner_id}")
        else:
            logger.warning(f"[Gateway] No support mobile, skipping support SMS for owner {owner_id}")

        producer.flush(timeout=5)  # flush برای اطمینان