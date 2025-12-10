import numpy as np

def compute_spo2(red_signal, ir_signal):
    DC_red = np.mean(red_signal)
    AC_red = np.max(red_signal) - np.min(red_signal)

    DC_ir = np.mean(ir_signal)
    AC_ir = np.max(ir_signal) - np.min(ir_signal)

    R = (AC_red / DC_red) / (AC_ir / DC_ir)

    # فرمول تجربی برای SpO2
    SpO2 = 110 - 25 * R
    return SpO2

# نمونه
# red_signal = np.array([...])  # لیست داده RED
# ir_signal = np.array([...])   # لیست داده IR
#
# spo2 = compute_spo2(red_signal, ir_signal)
# print("SpO2:", spo2)
