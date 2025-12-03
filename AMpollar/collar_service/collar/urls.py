from rest_framework.routers import DefaultRouter
from .views import CollarViewSet

router = DefaultRouter()
router.register("collars", CollarViewSet)

urlpatterns = router.urls
