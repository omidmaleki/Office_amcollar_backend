# gyro_process.py
import numpy as np


def process_gyro_data(payload, weight_kg=70):
    """
    Process accelerometer + gyro data and return posture, activity level, calories.
    """
    acc = np.array([payload["ACCx"], payload["ACCy"], payload["ACCz"]])
    gyro = np.array([payload["Gx"], payload["Gy"], payload["Gz"]])

    acc_mag = np.linalg.norm(acc)
    gyro_mag = np.linalg.norm(gyro)

    # Posture classification
    if acc_mag < 9.9 and gyro_mag < 0.1:
        posture = "lying"
    elif acc_mag < 10.5 and gyro_mag < 0.2:
        posture = "sitting"
    else:
        posture = "standing"

    # Activity level
    activity_level = abs(acc_mag - 9.8)

    # Estimate calories (per second)
    if posture == "lying":
        MET = 1.0
    elif posture == "sitting":
        MET = 1.3
    else:
        MET = 1.8 + activity_level * 5  # rough estimation

    calories = MET * weight_kg * (1 / 3600)

    return {
        "posture": posture,
        "activity_level": float(round(activity_level, 2)),
        "calories": float(round(calories, 4))
    }
