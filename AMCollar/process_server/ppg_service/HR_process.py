import numpy as np
from scipy.signal import butter, filtfilt
from reader import load_ppg
# -----------------------------
# 1. Band-pass filter (0.5 - 4 Hz)
# -----------------------------
def bandpass_filter(ppg, fs, lowcut=0.5, highcut=4.0, order=3):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, ppg)


# -----------------------------
# 2. Smooth (moving average)
# -----------------------------
def smooth_signal(ppg, window=5):
    return np.convolve(ppg, np.ones(window)/window, mode='same')


# -----------------------------
# 3. Peak Detection
# -----------------------------
def detect_peaks(ppg, fs):
    peaks = []
    threshold = np.mean(ppg) + 0.3 * np.std(ppg)
    min_interval = int(0.25 * fs) # 250 ms

    for i in range(1, len(ppg)-1):
        if ppg[i] > threshold and ppg[i] > ppg[i-1] and ppg[i] > ppg[i+1]:
            if len(peaks) == 0 or (i - peaks[-1]) > min_interval:
                peaks.append(i)

    return peaks


# -----------------------------
# 4. HR calculation
# -----------------------------
def compute_hr(ppg, fs):

    # Step 1: filter
    filtered = bandpass_filter(ppg, fs)

    # Step 2: smooth
    smoothed = smooth_signal(filtered)

    # Step 3: peaks
    peaks = detect_peaks(smoothed, fs)
    if len(peaks) < 2:
        return None # HR قابل محاسبه نیست

    # Step 4: RR intervals
    rr_intervals = np.diff(peaks) / fs # فاصله بین قله‌ها (ثانیه)

    # Step 5: HR
    hr_values = 60 / rr_intervals # bpm

    return float(np.mean(hr_values))


# # -----------------------------
# # Example usage
# # -----------------------------
# ppg = load_ppg()                       # لیست رشته‌ها
# ppg = np.array(ppg, dtype=float)
# fs = 150 # sample rate
# hr = compute_hr(ppg, fs)
# print("Heart Rate:", hr)