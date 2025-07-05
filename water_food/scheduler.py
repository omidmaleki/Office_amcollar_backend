# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from water_food.tasks import aggregate_daily_water_food
from django_apscheduler.models import DjangoJobExecution
import logging
import pytz

logger = logging.getLogger(__name__)

def start():
    scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Tehran'))
    scheduler.add_jobstore(DjangoJobStore(), "default")

    scheduler.add_job(
        aggregate_daily_water_food,
        trigger="cron",
        hour=23,
        minute=59,
        id="aggregate_daily_food_water",
        name="جمع‌بندی مصرف آب و غذا",
        replace_existing=True,
    )

    logger.info("⏰ Scheduler started - Daily food/water aggregation job added.")
    scheduler.start()
