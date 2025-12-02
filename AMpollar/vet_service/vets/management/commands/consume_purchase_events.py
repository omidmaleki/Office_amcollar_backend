from django.core.management.base import BaseCommand
import redis
from vets.models import VetForm


r = redis.Redis(host="redis", port=6379, decode_responses=True)


def init_group():
    try:
        r.xgroup_create("purchase_events", "vet_group", "$", mkstream=True)
    except:
        pass


def process_event(message_id, fields):
    VetForm.objects.create(
        owner_id=fields["owner_id"],
        pet_id=fields["pet_id"],
        purchase_id=fields["purchase_id"],
        status="pending"
    )
    r.xack("purchase_events", "vet_group", message_id)


def consume():
    init_group()

    while True:
        resp = r.xreadgroup(
            groupname="vet_group",
            consumername="vet_consumer",
            streams={"purchase_events": ">"},
            count=1,
            block=5000
        )

        if not resp:
            continue

        _, messages = resp[0]
        for message_id, fields in messages:
            process_event(message_id, fields)


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        consume()
