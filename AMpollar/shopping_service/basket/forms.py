from django import forms

from basket.models import BasketLine
from blog.models import Course

class AddToBasketForm(forms.Form):
    course = forms.ModelChoiceField(queryset=Course.objects.all(), widget=forms.HiddenInput())

    def save(self, basket):
        course = self.cleaned_data['course']

        # بررسی اینکه دوره قبلاً در سبد خرید وجود دارد یا نه
        exists = BasketLine.objects.filter(basket=basket, course=course).exists()

        if not exists:
            BasketLine.objects.create(basket=basket, course=course)

        return basket



