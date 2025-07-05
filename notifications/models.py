# notifications/models.py
from django.db import models
from django.utils import timezone
from users.models import User
from pet.models import Pet
from collar.models import Collar

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ("reminder", "Reminder"),               # یادآوری‌ها (واکسیناسیون، مراجعه، ...)
        ("info", "Information"),                # اطلاعات عمومی
        ("promo", "Promotional"),               # تخفیف و فروش ویژه
        ("system", "System Message"),           # پیام‌های سیستمی
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    pet = models.ForeignKey(Pet, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')

    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES, default="info")

    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(default=timezone.now)
    read_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
