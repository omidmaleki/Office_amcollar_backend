from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from .models import Collar, WifiCollarStatus
from .serializers import CollarSerializer, WifiCollarStatusSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class CollarViewSet(ModelViewSet):
    queryset = Collar.objects.all()
    serializer_class = CollarSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path=r"by-mac/(?P<mac_address>[^/.]+)"
    )
    def by_mac(self, request, mac_address=None):
        try:
            collar = Collar.objects.get(mac_address__iexact=mac_address)
        except Collar.DoesNotExist:
            return Response(
                {"error": "Collar not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "id": collar.id,
                "owner_id": collar.owner_id
            },
            status=status.HTTP_200_OK
        )

class WifiCollarStatusViewSet(viewsets.ModelViewSet):
    queryset = WifiCollarStatus.objects.all()
    serializer_class = WifiCollarStatusSerializer

    # فیلتر بر اساس owner_id
    def get_queryset(self):
        qs = super().get_queryset()
        owner_id = self.request.query_params.get("owner_id")
        if owner_id:
            qs = qs.filter(owner_id=owner_id)
        return qs

