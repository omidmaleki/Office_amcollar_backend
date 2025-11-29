from rest_framework.routers import DefaultRouter
from .views import PetViewSet, PetCategoryViewSet

router = DefaultRouter()
router.register(r'pets', PetViewSet, basename='pet')
router.register(r'categories', PetCategoryViewSet, basename='petcategory')

urlpatterns = router.urls