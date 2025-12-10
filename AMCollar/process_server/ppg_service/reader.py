import csv


def load_ppg():
    ppg_list = []

    with open("ppg_5min_100hz.csv", "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            ppg_list.append(row["ppg_raw"])

    return ppg_list
