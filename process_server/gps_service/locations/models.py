from django.db import models
from django.contrib.gis.db import models as gis_models

# Create your models here.
class Location(models.Model):
    pet_id = models.IntegerField()
    point = gis_models.PointField(geography=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pet.name} @ {self.point.y}, {self.point.x}"  # y=lat, x=lon

class Geofence(models.Model):
    pet_id = models.IntegerField()
    name = models.CharField(max_length=100)
    area = gis_models.PolygonField(geography=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Pet {self.pet_id})"


class Route(models.Model):
    pet_id = models.IntegerField()
    path = gis_models.LineStringField(geography=True)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Route for Pet {self.pet_id}"