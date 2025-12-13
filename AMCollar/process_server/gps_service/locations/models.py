from django.db import models
from django.contrib.gis.db import models as gis_models

# Create your models here.
class Location(models.Model):
    pet = models.IntegerField()
    point = gis_models.PointField(geography=True)  # latitude/longitude
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pet.name} @ {self.point.y}, {self.point.x}"  # y=lat, x=lon