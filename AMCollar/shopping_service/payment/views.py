
import logging
from django.urls import reverse
from azbankgateways import (
    bankfactories,
    models as bank_models,
    default_settings as settings,
)
from azbankgateways.exceptions import AZBankGatewaysException
from shopping_service.product.models import Product
from .services import publish_purchase_completed
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status



def go_to_gateway_view(request):
    price = Product.objects.get(slug='price').price
    amount = int(float(price))
    user_mobile_number = "+989112221234"

    factory = bankfactories.BankFactory()
    try:
        bank = (
            factory.auto_create()
        )  # or factory.create(bank_models.BankType.BMI) or set identifier
        bank.set_request(request)
        bank.set_amount(amount)

        # در صورت تمایل می توانید داده های دلخواه خود را به درگاه ارسال کنید
        bank.set_custom_data({"foo": "bar"})

        # یو آر ال بازگشت به نرم افزار برای ادامه فرآیند
        bank.set_client_callback_url(reverse("callback-gateway"))
        bank.set_mobile_number(user_mobile_number)  # اختیاری

        # در صورت تمایل اتصال این رکورد به رکورد فاکتور یا هر چیزی که بعدا بتوانید ارتباط بین محصول یا خدمات را با این
        # پرداخت برقرار کنید.
        bank_record = bank.ready()

        # هدایت کاربر به درگاه بانک
        return bank.redirect_gateway()
    except AZBankGatewaysException as e:
        logging.critical(e)
        # TODO: redirect to failed page.
        raise e


class CompletePaymentView(APIView):
    def post(self, request):
        # 1) اعتبارسنجی پرداخت و… (کد خودت)

        owner_id = request.data["owner_id"]
        pet_id = request.data["pet_id"]
        purchase_id = request.data["purchase_id"]

        # 2) ارسال event بعد از نهایی شدن سفارش
        publish_purchase_completed(owner_id, pet_id, purchase_id)

        return Response({"status": "payment completed"})




# payment/views.py
from rest_framework.views import APIView
from rest_framework.response import Response


class ProcessPaymentView(APIView):
    def post(self, request):
        user_id = request.data["user_id"]
        product_id = request.data["product_id"]
        amount = request.data["amount"]
        payment_id = "PAY-" + str(user_id) + "-" + str(product_id)

        # ارسال به Kafka
        publish_order_event({
            "user_id": user_id,
            "product_id": product_id,
            "amount": amount,
            "payment_id": payment_id
        })

        return Response({"status": "payment_success", "payment_id": payment_id})

