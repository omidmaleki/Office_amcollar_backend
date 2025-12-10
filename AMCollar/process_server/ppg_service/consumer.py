from kafka import KafkaConsumer
import json
import numpy as np
from HR_process import compute_hr
from SPO2_process import compute_spo2

KAFKA_SERVERS = "kafka:9092"

FS = 150              # Sampling rate
SEND_COUNT = 10   # چند batch برای محاسبه HR و SpO2
HRV_COUNT = 30         # چند HR برای محاسبه HRV

# Buffers
ir_buffer = []
red_buffer = []
hr_list = []

EXPECTED_SAMPLES = None   # تعداد نمونه واقعی هر batch را بعداً کشف می‌کنیم


def normalize_kafka_message(value):
    """
    این تابع تضمین می‌کند که:
    - اگر Kafka لیست ارسال کرد، همان را برمی‌گرداند
    - اگر پیام تکی ارسال شد، تبدیل به لیست می‌شود
    """

    if isinstance(value, list):
        return value

    if isinstance(value, dict):
        return [value]

    raise ValueError(f"Invalid Kafka message format: {value}")


def start_consumer():
    consumer = KafkaConsumer(
        "ppg",
        bootstrap_servers=KAFKA_SERVERS,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        auto_offset_reset="latest",
        enable_auto_commit=True
    )

    print("[PPG] Consumer started...")

    global ir_buffer, red_buffer, hr_list, EXPECTED_SAMPLES

    for message in consumer:

        batch_msgs = normalize_kafka_message(message.value)

        # Debug: Print batch info
        print(f"\n📥 Received Kafka batch with {len(batch_msgs)} items")

        for msg in batch_msgs:

            # payload همیشه string است → باید json شود
            payload = json.loads(msg["payload"])

            ir_samples = payload["samples"]["ir"]
            red_samples = payload["samples"]["red"]

            # Detect expected number of samples per message (only first time)
            if EXPECTED_SAMPLES is None:
                EXPECTED_SAMPLES = len(ir_samples)
                print(f"🔍 Detected {EXPECTED_SAMPLES} samples per message")

            ir_buffer.extend(ir_samples)
            red_buffer.extend(red_samples)

        print(f"📊 buffers → IR: {len(ir_buffer)}, RED: {len(red_buffer)}")

        # اگر به حد لازم رسیدیم پردازش کنیم
        if EXPECTED_SAMPLES and len(ir_buffer) >= SEND_COUNT * EXPECTED_SAMPLES:

            ir_array = np.array(ir_buffer, dtype=float)
            red_array = np.array(red_buffer, dtype=float)

            print(f"⚙️ Processing {len(ir_array)} samples...")

            # HR
            try:
                hr = compute_hr(ir_array, FS)
                if hr:
                    print(f"❤️ HR: {hr}")
                    hr_list.append(hr)
                else:
                    print("⚠️ HR: No valid HR detected")
            except Exception as e:
                print(f"❌ HR error: {e}")

            # SPO2
            try:
                spo2 = compute_spo2(ir_array, red_array)
                if spo2:
                    print(f"🩸 SPO2: {spo2}")
                else:
                    print("⚠️ SPO2: No valid SPO2 detected")
            except Exception as e:
                print(f"❌ SPO2 error: {e}")

            # Clear buffers
            ir_buffer.clear()
            red_buffer.clear()

        # HRV calculation
        if len(hr_list) >= HRV_COUNT:
            hrv = float(np.mean(hr_list))
            print(f"💓 HRV (avg of {HRV_COUNT} HR values): {hrv}")
            hr_list.clear()


if __name__ == "__main__":
    start_consumer()
