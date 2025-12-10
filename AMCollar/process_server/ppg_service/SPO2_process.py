import numpy as np
#spo2
def compute_spo2(red_signal, ir_signal):
    DC_red = np.mean(red_signal)
    AC_red = np.max(red_signal) - np.min(red_signal)

    DC_ir = np.mean(ir_signal)
    AC_ir = np.max(ir_signal) - np.min(ir_signal)

    if AC_red < 1e-3 or AC_ir < 1e-3:
        return None

    R = (AC_red / DC_red) / (AC_ir / DC_ir)

    SpO2 = 110 - 25 * R
    return SpO2

