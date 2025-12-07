from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, VetNewOrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'vet-new-order', VetNewOrderViewSet, basename='vet-new-order')

urlpatterns = router.urls
