# water_food/management/commands/aggregate_daily.py
from django.core.management.base import BaseCommand
from water_food.tasks import aggregate_daily_water_food

class Command(BaseCommand):
    help = 'Aggregate daily water and food consumption and generate alerts'

    def handle(self, *args, **kwargs):
        self.stdout.write("🔄 Starting daily water/food aggregation...")
        aggregate_daily_water_food()
        self.stdout.write(self.style.SUCCESS("✅ Aggregation completed successfully."))
