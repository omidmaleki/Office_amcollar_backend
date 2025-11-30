from audioop import reverse

from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404

from django.views.decorators.http import require_POST
from urllib3 import request

from basket.forms import AddToBasketForm

from blog.models import Course, Enrollment


from django.contrib.auth.decorators import login_required


# Create your views here.

import requests
from django.shortcuts import redirect, HttpResponse
from django.conf import settings
from django.contrib import messages
from django.db.models import Sum
from .models import Basket, BasketLine, PurchasedCourse
from suds.client import Client

if settings.SANDBOX:
    sandbox = 'sandbox'
else:
    sandbox = 'payment'

MMERCHANT_ID = settings.MERCHANT  # مرچنت کد شما
ZARINPAL_WEBSERVICE = 'https://www.zarinpal.com/pg/services/WebGate/wsdl'
DESCRIPTION = u'توضیحات تراکنش تستی'  # توضیحات تراکنش
EMAIL = 'user@userurl.ir'  # ایمیل (اختیاری)
MOBILE = '09123456789'  # شماره موبایل (اختیاری)


def order_pay_view(request):
    # ساخت آدرس callback به صورت داینامیک
    callback_url = 'http://127.0.0.1:8001/basket/verify/'

    client = Client(ZARINPAL_WEBSERVICE)

    basket, created = Basket.objects.get_or_create(user=request.user)
    total_amount = basket.total_amount()
    if total_amount is None or total_amount <= 0:
        return HttpResponse("Your basket is empty or the amount is invalid.", status=400)

    AMOUNT = int(total_amount)

    result = client.service.PaymentRequest(
        MMERCHANT_ID,
        AMOUNT,
        DESCRIPTION,
        EMAIL,
        MOBILE,
        callback_url
    )

    if result.Status == 100:

        return redirect('https://www.zarinpal.com/pg/StartPay/' + result.Authority)
    else:
        return HttpResponse(f'Error: PaymentRequest failed with status {result.Status}')


def verify_pay_view(request):
    client = Client(ZARINPAL_WEBSERVICE)

    basket, created = Basket.objects.get_or_create(user=request.user)
    basket_lines = BasketLine.objects.filter(basket=basket)
    total_amount = basket.total_amount()

    if total_amount is None or total_amount <= 0:
        return HttpResponse("Your basket is empty or the amount is invalid.", status=400)

    AMOUNT = int(total_amount)

    if request.GET.get('Status') == 'OK':
        authority = request.GET.get('Authority')
        result = client.service.PaymentVerification(MMERCHANT_ID, authority, AMOUNT)

        if result.Status == 100:

            # افزودن دوره‌ها به خریدهای کاربر
            purchased_courses = []
            for line in basket_lines:
                course = line.course

                if not PurchasedCourse.objects.filter(user=request.user, course=course).exists():
                    purchased_course = PurchasedCourse.objects.create(
                        user=request.user,
                        course=course,
                        ref_id=result.RefID  # ذخیره شماره تراکنش
                    )
                    purchased_courses.append(course)

            # پاک کردن سبد خرید پس از پرداخت موفقیت‌آمیز
            basket_lines.delete()

            # نمایش صفحه "بعد از پرداخت"
            return render(request, 'basket/after-payment.html', {
                'user': request.user,
                'courses': purchased_courses,
                'total_amount': total_amount,
                'company_name': 'مایا ازما',
                'transaction_id': result.RefID,
            })

        elif result.Status == 101:
            return HttpResponse('Transaction submitted: ' + str(result.Status))

        else:
            return HttpResponse('Transaction failed. Status: ' + str(result.Status))

    else:
        return HttpResponse('Transaction failed or canceled by user')


@require_POST
def add_to_basket(request):
    next_url = request.POST.get('next', request.META.get('HTTP_REFERER', '/'))
    response = HttpResponseRedirect(next_url)

    basket, created = Basket.objects.get_or_create(user=request.user)

    if not request.user.is_authenticated:
        response.set_cookie('basket_id', basket.id)

    course_id = request.POST.get('course_id')
    if not course_id:
        return response

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return response

    form = AddToBasketForm(request.POST)

    if form.is_valid():
        form.save(basket=basket)

    return response



@login_required
def remove_from_basket(request, line_id):
    """
    Removes a specific item from the user's basket.
    """
    basket_line = get_object_or_404(BasketLine, id=line_id, basket__user=request.user)
    basket_line.delete()

    return redirect('basket:cart')  # Redirect to the cart page after removing




def cart_view(request):
    if not request.user.is_authenticated:
        return redirect('login')

    basket, created = Basket.objects.get_or_create(user=request.user)

    basket_lines = BasketLine.objects.filter(basket=basket)

    total_amount = basket_lines.aggregate(total=Sum('course__price'))['total'] or 0

    return render(request, 'basket/basket.html', {
        'basket_lines': basket_lines,
        'total_amount': total_amount,
        'basket_item_count': basket_lines.count()
    })


@login_required
def enroll_course(request, course_id):
    """ User registration in the course (after payment) """
    course = get_object_or_404(Course, id=course_id)

    if Enrollment.objects.filter(user=request.user, course=course).exists():
        messages.warning(request, "شما قبلاً در این دوره ثبت‌نام کرده‌اید.")
        return redirect(course.get_absolute_url())

    # ثبت‌نام کاربر در دوره
    Enrollment.objects.create(user=request.user, course=course)
    messages.success(request, "ثبت‌نام شما با موفقیت انجام شد!")

    return redirect('dashboard')







