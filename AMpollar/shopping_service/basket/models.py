
from django.db import models
from django.conf import settings
from blog.models import Course

from django.db.models import Sum

# Create your models here.
class Basket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='baskets', null=True, blank=True)
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "سبد خرید"
        verbose_name_plural = "سبد خرید"

    def __str__(self):
        return str(self.user)

    def add(self, course, qty = 1):
        if self.basket_lines.filter(course=course).exists():
            course_line = self.basket_lines.filter(course=course).first()
            course_line.quantity += qty
            course_line.save()
        else:
            course_line = self.basket_lines.create(course=course, quantity=qty)
        return course_line

    def validate_user(self, user):
        if not user.is_authenticated:
            return False

        print(f"Basket user: {self.user}")
        print(f"Request user: {user}")


        if self.user and self.user != user:
            print("User mismatch! Validation failed.")
            return False


        if self.user is None:
            self.user = user
            self.save()

        return True  # سبد خرید معتبر است

    @classmethod
    def get_basket(cls, basket_id):
        if basket_id is None:
            basket = cls.objects.create()
        else:
            try:
                basket = cls.objects.get(pk=basket_id)
            except cls.DoesNotExist:
                basket = None
        return basket

    def total_amount(self):
        return self.basket_lines.aggregate(total=Sum('course__price'))['total'] or 0


class BasketLine(models.Model):
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE, related_name='basket_lines')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='basket_lines')

    def __str__(self):
        return f'{self.basket} => {self.course}'


class PurchasedCourse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchased_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='purchased_by')
    purchase_date = models.DateTimeField(auto_now_add=True)
    ref_id = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        verbose_name = "خریداری شده"
        verbose_name_plural = "خریداری شده"
        unique_together = ('user', 'course')  # جلوگیری از ثبت تکراری

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"


