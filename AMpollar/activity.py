import csv
from datetime import datetime, timedelta
import os

FILE_NAME = "work_hours.csv"

def log_work(start_str, end_str):
    start = datetime.strptime(start_str, "%Y-%m-%d %H:%M")
    end = datetime.strptime(end_str, "%Y-%m-%d %H:%M")
    duration = end - start  # timedelta

    # ذخیره در CSV
    file_exists = os.path.isfile(FILE_NAME)
    with open(FILE_NAME, mode='a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Date", "Start", "End", "Duration"])
        writer.writerow([start.date(), start.time(), end.time(), str(duration)])

    print(f"Logged: {start} → {end} | Duration: {duration}")

def total_hours():
    if not os.path.isfile(FILE_NAME):
        print("No work logs yet.")
        return

    total = timedelta()
    work_days = set()  # مجموعه برای شمارش روزهای منحصر به فرد
    with open(FILE_NAME, mode='r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            h, m, s = map(int, str(row["Duration"]).split(":"))
            total += timedelta(hours=h, minutes=m, seconds=s)
            work_days.add(row["Date"])  # اضافه کردن تاریخ به مجموعه

    total_hours = total.total_seconds() / 3600
    print(f"Total worked hours: {total_hours:.2f}h")
    print(f"Total days worked: {len(work_days)}")

if __name__ == "__main__":
    while True:
        print("\n1. Log work hours")
        print("2. Show total hours")
        print("3. Exit")
        choice = input("Select option: ")

        if choice == "1":
            start_input = input("Enter start (YYYY-MM-DD HH:MM): ")
            end_input = input("Enter end   (YYYY-MM-DD HH:MM): ")
            log_work(start_input, end_input)
        elif choice == "2":
            total_hours()
        elif choice == "3":
            break
        else:
            print("Invalid option.")
