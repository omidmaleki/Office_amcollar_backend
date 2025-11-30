from django.urls import path

from basket.views import (add_to_basket, cart_view, remove_from_basket, order_pay_view,
                          verify_pay_view)
from blog.views import enroll_course

app_name = 'basket'
urlpatterns = [
    path('add/', add_to_basket, name='add-to-basket'),
    path('cart/', cart_view, name='cart'),
    path('enroll/<int:course_id>/', enroll_course, name='enroll_course'),
    path('cart/remove/<int:line_id>/', remove_from_basket, name='remove_from_basket'),
    path('request/',order_pay_view,name='pay'),
    path('verify/', verify_pay_view, name='verify'),
    # path('after_payment/', after_payment_view, name='after_payment'),

]