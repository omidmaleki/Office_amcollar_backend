from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


class SingleProductView(APIView):
    def get(self, request):
        product = Product.objects.first()

        if not product:
            return Response({"detail": "No product found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product)
        return Response(serializer.data)
