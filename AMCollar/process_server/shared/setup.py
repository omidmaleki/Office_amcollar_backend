from setuptools import setup, find_packages

setup(
    name="process_server_shared",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests",  # اگر shared از requests استفاده می‌کنه
        # سایر وابستگی‌ها
    ],
)
