from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = "__all__"


class PetInfo2Serializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        # فقط فیلدهایی که میخوای برای اطلاعات ثانویه آپدیت بشن
        fields = [
            'id',
            'name',
            'owner_id',
            'vet_id',
            'collar_id',
            'species',
            'age',
            'sex',
            'pet_image',
            'race',
            'weight',
            'neutered',
            'surgery_history',
            'annual_vaccine_date',
        ]
        read_only_fields = ['id', 'owner_id', 'vet_id', 'collar_id']  # جلوگیری از تغییر owner/collar/vet