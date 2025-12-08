from rest_framework.viewsets import ModelViewSet
from .models import Collar
from .serializers import CollarSerializer

class CollarViewSet(ModelViewSet):
    queryset = Collar.objects.all()
    serializer_class = CollarSerializer
