# system_thresholds/utils.py
from .models import PetCategory, SystemThreshold
from django.db import models

def find_pet_category(pet):
    weight = pet.weight_kg
    age = pet.age_months
    species = pet.species
    breed = pet.breed

    # جستجو دسته بر اساس شرایط
    categories = PetCategory.objects.filter(species=species)

    if breed:
        categories = categories.filter(models.Q(breed=breed) | models.Q(breed__isnull=True))
    else:
        categories = categories.filter(breed__isnull=True)

    # فیلتر کردن بر اساس وزن و سن
    categories = categories.filter(
        min_weight__lte=weight,
        max_weight__gte=weight,
        min_age_months__lte=age,
        max_age_months__gte=age,
    )

    return categories.first()  # یا None

def calculate_thresholds_for_pet(pet):
    category = find_pet_category(pet)
    if not category:
        return None

    # فرمول‌های ساده - قابل گسترش
    weight = pet.weight_kg

    # محاسبه RER و DER
    RER = 70 * (weight ** 0.75)
    DER = RER * 1.6  # فرض مثال

    daily_calories = DER
    daily_water_ml = weight * 60  # مثلا 60 میلی لیتر در کیلوگرم
    # فرض کالری غذا 350 در 100 گرم
    daily_food_grams = (daily_calories / 350) * 100

    # ذخیره یا به‌روزرسانی رکورد
    threshold, created = SystemThreshold.objects.update_or_create(
        category=category,
        defaults={
            'daily_calories': daily_calories,
            'daily_water_ml': daily_water_ml,
            'daily_food_grams': daily_food_grams,
        }
    )
    return threshold
