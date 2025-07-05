# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
#---------------------------------------------------------------------
class User(AbstractUser):                                                                 # User App DB Model

    OWNER = 'owner'                                                                       # CONSTANT
    VET = 'vet'                                                                           # CONSTANT
    ROLE_CHOICES = [
        (OWNER, 'Owner'),
        (VET, 'Vet'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)                          # role --> 'Owner' or 'Vet'
    phone_regex = RegexValidator(                                                         # Regex Phone Number Pattern
        regex=r'^09\d{9}$',
        message="شماره تلفن به درستی وارد نشده است."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=11, blank=False) # Mandatory field
    def __str__(self):
        return f"{self.username} ({self.role})"


