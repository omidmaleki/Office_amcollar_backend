import numpy as np
from math import sqrt

def process_window(data_window, weight_kg, species_factor, breed_factor, window_seconds=5):
    """
    data_window: list of sensor payloads over time window
    weight_kg: weight of the pet in kg
    breed_factor: breed-specific activity factor
    species_factor: species-specific factor
    window_seconds: duration of the data window in seconds
    """

    # Extract accelerometer data
    acc = np.array([[d.get("ACCx",0), d.get("ACCy",0), d.get("ACCz",0)] for d in data_window])

    # Compute VM (Vector Magnitude)
    vm_array = 9.8 * np.linalg.norm(acc, axis=1)  # g to m/s²

    # Activity count as sum of absolute VM
    activity_count = np.sum(np.abs(vm_array))

    # Average VM for calories calculation
    avg_vm = vm_array.mean()

    # Calories calculation according to formula
    calories = (window_seconds * avg_vm * weight_kg) + breed_factor + species_factor + 70 * (weight_kg ** 0.75)

    # Compute posture based on acc magnitude
    acc_mean = np.mean(np.linalg.norm(acc, axis=1))
    if acc_mean < 9.9:
        posture = "lying"
    elif acc_mean < 10.5:
        posture = "sitting"
    else:
        posture = "standing"

    # Compute behavior based on activity intensity
    activity_intensity = np.var(np.linalg.norm(acc, axis=1))
    if activity_intensity < 0.02:
        behavior = "sleep"
    elif activity_intensity < 0.1:
        behavior = "rest"
    elif activity_intensity < 0.5:
        behavior = "active"
    else:
        behavior = "highly_active"

    result = {
        "calories": round(calories, 2),
        "activity_count": round(activity_count, 2),
        "VM": round(avg_vm, 2),
        "posture": posture,
        "behavior": behavior
    }

    return result