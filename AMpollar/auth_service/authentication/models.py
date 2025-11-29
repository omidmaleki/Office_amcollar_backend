from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import hashlib


class OwnerManager(BaseUserManager):
    def create_owner(self, phone, role="owner", password=None):
        if not phone:
            raise ValueError("Owners must have a phone number")
        owner = self.model(phone=phone, role=role)
        owner.set_unusable_password()
        owner.save(using=self._db)
        return owner

    def create_superowner(self, phone, password=None):
        owner = self.create_owner(phone, role="admin")
        owner.is_staff = True
        owner.is_superuser = True
        owner.save(using=self._db)
        return owner


class Owner(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(max_length=32, unique=True)
    role = models.CharField(max_length=32, default="owner")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    objects = OwnerManager()

    def __str__(self):
        return self.phone


class OTP(models.Model):
    phone = models.CharField(max_length=32)
    role = models.CharField(max_length=20, default="owner")
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    @classmethod
    def make_hash(cls, code):
        return hashlib.sha256(code.encode()).hexdigest()
