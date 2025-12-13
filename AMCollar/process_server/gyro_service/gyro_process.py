import numpy as np

def compute_bmi(weight_kg, height_m):
    return weight_kg / (height_m ** 2)


def process_window(data_window, weight_kg, height_m, window_seconds):
    """
    data_window: list of sensor payloads over time window
    """

    acc = np.array([[d["ACCx"], d["ACCy"], d["ACCz"]] for d in data_window])
    gyro = np.array([[d["Gx"], d["Gy"], d["Gz"]] for d in data_window])

    acc_mag = np.linalg.norm(acc, axis=1)
    gyro_mag = np.linalg.norm(gyro, axis=1)

    acc_mean = acc_mag.mean()
    acc_var = acc_mag.var()
    gyro_mean = gyro_mag.mean()

    # -------- Posture --------
    if acc_mean < 9.9 and gyro_mean < 0.05:
        posture = "lying"
    elif acc_mean < 10.5:
        posture = "sitting"
    else:
        posture = "standing"

    # -------- Activity Level --------
    activity_intensity = acc_var

    # -------- Behavior State --------
    if activity_intensity < 0.02 and gyro_mean < 0.03:
        behavior = "sleep"
    elif activity_intensity < 0.1:
        behavior = "rest"
    elif activity_intensity < 0.5:
        behavior = "active"
    else:
        behavior = "highly_active"

    # -------- MET Assignment --------
    MET_MAP = {
        "sleep": 0.95,
        "rest": 1.2,
        "active": 2.5,
        "highly_active": 4.5
    }

    MET = MET_MAP[behavior]

    calories = MET * weight_kg * (window_seconds / 3600)

    return {
        "posture": posture,
        "behavior": behavior,
        "activity_intensity": round(activity_intensity, 4),
        "calories": round(calories, 4),
        "BMI": round(compute_bmi(weight_kg, height_m), 2),
        "sleep_time_sec": window_seconds if behavior == "sleep" else 0,
        "activity_time_sec": window_seconds if behavior in ["active", "highly_active"] else 0
    }
