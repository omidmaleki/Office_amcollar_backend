from rest_framework.generics import ListAPIView
from .models import Order
from .serializers import OrderSerializer

class ListOrdersView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
