# basket/context_processors.py
from django.db.models import Sum

from .models import Basket, BasketLine

def header_data(request):
    basket = None
    if request.user.is_authenticated:
        basket, created = Basket.objects.get_or_create(user=request.user)
    else:
        basket_id = request.COOKIES.get('basket_id', None)
        basket = Basket.get_basket(basket_id)

    basket_lines = BasketLine.objects.filter(basket=basket)

    basket_lines = BasketLine.objects.filter(basket=basket)
    basket_item_count = basket_lines.count()
    total_amount = basket_lines.aggregate(total=Sum('course__price'))['total'] or 0

    return {
        'basket_lines': basket_lines,
        'basket_item_count': basket_item_count,
        'total_amount': total_amount,
    }
