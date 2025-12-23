import json
import logging
import time
import os

from kafka import KafkaConsumer
from kafka.errors import KafkaError, NoBrokersAvailable

from django.conf import settings
from notification.tasks import send_sms_task

# Kafka logging رو کم کن (فقط ERROR)
logging.getLogger('kafka').setLevel(logging.ERROR)
logging.getLogger('kafka.conn').setLevel(logging.ERROR)

# Django logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def start_sms_consumer():
    bootstrap_servers = getattr(settings, 'KAFKA_BOOTSTRAP_SERVERS', None)
    if not bootstrap_servers:
        logger.error("[SMS Service] KAFKA_BOOTSTRAP_SERVERS not set!")
        raise ValueError("Kafka servers not configured")

    logger.info(f"[SMS Service] Attempting to start Kafka consumer on {bootstrap_servers}")

    max_retries = 10
    retry_count = 0
    consumer = None
    while retry_count < max_retries:
        try:
            consumer = KafkaConsumer(
                "vetform_topic",
                bootstrap_servers=bootstrap_servers,
                group_id="sms-service-group",
                auto_offset_reset="earliest",
                enable_auto_commit=False,
                value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                key_deserializer=lambda k: k.decode("utf-8") if k else None,
                max_poll_records=10,
                # اضافه: timeout برای fetch (اگر no message، هر ۳۰ ثانیه poll کن)
                consumer_timeout_ms=30000,  # ۳۰ ثانیه timeout
                # برای compatibility با Confluent
                api_version=(3, 0),  # explicit version
                request_timeout_ms=30000,
                connections_max_idle_ms=60000,
            )
            logger.info(f"[SMS Service] Kafka consumer started successfully! Group: sms-service-group, Topic: vetform_topic")
            break

        except NoBrokersAvailable as e:
            retry_count += 1
            logger.warning(f"[SMS Service] No brokers (attempt {retry_count}/{max_retries}): {e}. Retrying in 10s...")
            time.sleep(10)
        except KafkaError as e:
            retry_count += 1
            logger.error(f"[SMS Service] Kafka error (attempt {retry_count}/{max_retries}): {e}. Retrying in 10s...")
            time.sleep(10)
        except Exception as e:
            logger.exception(f"[SMS Service] Unexpected error (attempt {retry_count}/{max_retries}): {e}")
            time.sleep(10)

    if retry_count == max_retries or not consumer:
        logger.error("[SMS Service] Max retries reached. Exiting.")
        raise RuntimeError("Failed to connect to Kafka")

    # Loop با poll explicit برای robustness
    try:
        logger.info("[SMS Service] Entering message consumption loop. Waiting for messages...")
        while True:  # manual loop به جای for message in consumer (برای بهتر control)
            msg_pack = consumer.poll(timeout_ms=10000, max_records=10)  # poll هر ۱۰ ثانیه
            for topic_partition, messages in msg_pack.items():
                for message in messages:
                    try:
                        event = message.value
                        event_type = event.get("event_type")

                        if event_type != "SEND_SMS":
                            consumer.commit()
                            continue

                        logger.info(f"[SMS Service] Processing SMS event: {event_type}")
                        send_sms_task.delay(event)
                        consumer.commit()

                    except json.JSONDecodeError as e:
                        logger.error(f"[SMS Service] Invalid JSON: {e}. Skipping.")
                        consumer.commit()
                    except Exception as e:
                        logger.exception(f"[SMS Service] Error processing message: {getattr(message, 'value', 'Unknown')}")
                        # commit نکن

            if not any(len(msgs) for msgs in msg_pack.values()):  # اگر no message، لاگ بزن
                logger.debug("[SMS Service] No new messages. Polling again...")

    except KeyboardInterrupt:
        logger.info("[SMS Service] Consumer stopped.")
    except Exception as e:
        logger.exception("[SMS Service] Loop error: %s", e)
    finally:
        if consumer:
            consumer.close()
            logger.info("[SMS Service] Consumer closed.")

if __name__ == "__main__":
    start_sms_consumer()