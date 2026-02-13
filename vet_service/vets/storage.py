# vets/storage.py
from django.core.files.storage import FileSystemStorage
from django.conf import settings

class VetMediaStorage(FileSystemStorage):
    """
    Storage اختصاصی برای فایل‌های اپ vet
    - همه فایل‌ها رو توی زیرپوشه /app/media/vet/ ذخیره می‌کنه
    - URL عمومیش می‌شه https://amcollar.com/media/vet/...
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # مسیر فیزیکی داخل کانتینر/سرور
        self.location = '/app/media/vet'          # تغییر بده اگر مسیر volume فرق داره
        # base URL که توی پاسخ API برمی‌گرده
        self.base_url = 'https://amcollar.com/media/vet/'             # یا 'https://amcollar.com/media/vet/' اگر absolute می‌خوای

    # اگر بعداً خواستی به S3 تغییر بدی، فقط اینجا backend رو عوض می‌کنی