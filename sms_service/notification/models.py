from django.db import models

# Create your models here.
class Veterinary(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50)
    meeting_date_time = models.DateTimeField()

class ContactUs(models.Model):
    title = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    description = models.TextField()

