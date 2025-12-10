from kafka import KafkaConsumer
import json
import numpy as np
from HR_process import compute_hr
from SPO2_process import compute_spo2

KAFKA_SERVERS = "kafka:9092"
FS = 150
SEND_COUNT = 10  # تعداد batch برای HR و SpO2
HRV_COUNT = 30   # تعداد HR برای محاسبه HRV

# بافرها
ir_buffer = []
red_buffer = []
hr_list = []

def start_consumer():
    consumer = KafkaConsumer(
        "ppg",
        bootstrap_servers=KAFKA_SERVERS,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        auto_offset_reset="latest",
        enable_auto_commit=True
    )

    print("[PPG] Consumer started...")

    global ir_buffer, red_buffer, hr_list

    for message in consumer:
        batch_msgs = message.value  # اینجا batch از Kafka دریافت می‌شود

        for msg in batch_msgs:
            payload = json.loads(msg["payload"])
            ir_samples = payload["samples"]["ir"]
            red_samples = payload["samples"]["red"]

            ir_buffer.extend(ir_samples)
            red_buffer.extend(red_samples)

        if len(ir_buffer) >= SEND_COUNT * 100:  # فرض هر batch 100 نمونه
            ir_array = np.array(ir_buffer, dtype=float)
            red_array = np.array(red_buffer, dtype=float)

            hr = compute_hr(ir_array, FS)
            spo2 = compute_spo2(ir_array, red_array)

            if hr:
                print(f"❤️ Heart Rate: {hr}")
                hr_list.append(hr)
            if spo2:
                print(f"SPO2: {spo2}")

            ir_buffer.clear()
            red_buffer.clear()

        if len(hr_list) >= HRV_COUNT:
            hrv = np.mean(hr_list)
            print(f"💓 HRV (average over {HRV_COUNT} HRs): {hrv}")
            hr_list.clear()

if __name__ == "__main__":
    start_consumer()



































# from kafka import KafkaConsumer
# import json
# import numpy as np
# from HR_process import compute_hr
# from SPO2_process import compute_spo2
#
# KAFKA_SERVERS = "kafka:9092"
# SEND_COUNT = 10
# HRV_COUNT = 30
# FS = 150
#
#
# ir_buffer = []
# ir_counter = 0
#
# red_buffer = []
# red_counter = 0
#
#
# hr_list = []
#
# def start_consumer():
#     consumer = KafkaConsumer(
#         "ppg",
#         bootstrap_servers=KAFKA_SERVERS,
#         value_deserializer=lambda v: json.loads(v.decode("utf-8")),
#         auto_offset_reset="latest",
#     )
#
#     print("[PPG] Consumer started...")
#
#     global ir_buffer, ir_counter, hr_list, red_buffer, red_counter
#
#     for message in consumer:
#         data = message.value
#
#         ir_samples = data["samples"]["ir"]
#         ir_buffer.extend(ir_samples)
#         ir_counter += 1
#
#         red_samples = data["samples"]["red"]
#         red_buffer.extend(red_samples)
#         red_counter += 1
#
#         if ir_counter >= SEND_COUNT:
#             ppg_array = np.array(ir_buffer, dtype=float)
#             hr = compute_hr(ppg_array, FS)
#
#             if hr:
#                 print(f"❤️ Heart Rate (after {SEND_COUNT} batches):", hr)
#                 hr_list.append(hr)
#
#             red_array = np.array(red_buffer, dtype=float)
#             ir_array = np.array(ir_buffer, dtype=float)
#             spo2 = compute_spo2(ir_array, red_array)
#
#             if spo2:
#                 print(f"SPO2 after {SEND_COUNT} batches:", spo2)
#
#             ir_buffer.clear()
#             ir_counter = 0
#
#             red_buffer.clear()
#             red_counter = 0
#
#         if len(hr_list) >= HRV_COUNT:
#             hrv = np.mean(hr_list)
#             print(f"💓 HRV (average over {HRV_COUNT} HRs):", hrv)
#             hr_list.clear()
#
#
# if __name__ == "__main__":
#     start_consumer()