from rest_framework import serializers
from .models import Threshold, RadiographyImage, TestReport, SurgeryHistory

import requests

PET_SERVICE = "http://pet:8000"
class ThresholdSerializer(serializers.ModelSerializer):

    class Meta:
        model = Threshold
        fields = "__all__"

    def validate_pet_id(self, value):
        """
        validate pet exists in Pet Service
        """
        try:
            resp = requests.get(f"{PET_SERVICE}/pets/{value}/", timeout=5)
            if resp.status_code != 200:
                raise serializers.ValidationError("Pet does not exist.")
        except requests.exceptions.RequestException:
            raise serializers.ValidationError("PetService unavailable.")

        return value

    def validate(self, data):
        """
        validate all numeric fields
        """

        numeric_fields = [
            "heart_rate",
            "body_temperature",
            "respiratory_rate",
            "oxygen_saturation",
            "hrv",
            "calories_consumed",
            "sleep_amount",
            "activity_amount",
            "water_consumption",
            "food_consumption",
        ]

        for field in numeric_fields:
            value = data.get(field)
            if value is not None:
                if value < 0:
                    raise serializers.ValidationError(
                        {field: "Value must be positive."}
                    )

        # range checks
        if "body_temperature" in data:
            if not (30 <= data["body_temperature"] <= 45):
                raise serializers.ValidationError({
                    "body_temperature": "Must be between 30 and 45 °C"
                })

        if "oxygen_saturation" in data:
            if not (70 <= data["oxygen_saturation"] <= 100):
                raise serializers.ValidationError({
                    "oxygen_saturation": "Must be between 70% and 100%"
                })

        if "heart_rate" in data:
            if not (20 <= data["heart_rate"] <= 350):
                raise serializers.ValidationError({
                    "heart_rate": "Must be between 20 and 350 bpm"
                })

        return data


class RadiographySerializer(serializers.ModelSerializer):
    class Meta:
        model = RadiographyImage
        fields = "__all__"


class TestReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestReport
        fields = "__all__"


class SurgeryHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SurgeryHistory
        fields = "__all__"
