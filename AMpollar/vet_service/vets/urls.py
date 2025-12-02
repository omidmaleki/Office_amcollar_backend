from rest_framework.routers import DefaultRouter
from .views import VetViewSet, VetFormViewSet

router = DefaultRouter()
router.register(r'vets', VetViewSet)
router.register(r'vet-forms', VetFormViewSet)

urlpatterns = router.urls
