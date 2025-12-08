import redis

r = redis.Redis(host="redis", port=6379, decode_responses=True)

def publish_purchase_completed(owner_id, pet_id, purchase_id):
    r.xadd("purchase_events", {
        "owner_id": owner_id,
        "pet_id": pet_id,
        "purchase_id": purchase_id
    })
