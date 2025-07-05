# water_food/apps.py
from django.apps import AppConfig

class WaterFoodConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'water_food'

    def ready(self):
        from water_food import scheduler  # اینجا فایل scheduler.py رو ایمپورت میکنیم
