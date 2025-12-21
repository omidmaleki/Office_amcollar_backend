# Changelog

## [0.1.0] – 2025-12-13

### Added
- اضافه شدن سرویس **Location Service** برای مدیریت موقعیت مکانی.
- اضافه شدن مستندات مربوط به پردازش ژیروسکوپ (`gyro_process.md`).
- بهبود و توسعه الگوریتم ژیروسکوپ.

### Changed
- به‌روزرسانی و اصلاح فایل `requirements.txt` برای سرویس‌های مختلف (vet و collar).
- بهبود ساختار وابستگی‌ها برای اجرای صحیح سرویس‌ها.

### Fixed
- رفع مشکل فایل `requirements.txt` در سرویس‌ها (Hotfix).

### Merged
- ادغام شاخه `amcollar-Feature` در `amcollar-hesam-dev`.
- ادغام شاخه `amcollar-hotfix` در شاخه توسعه.

## [0.1.1] – 2025-12-14
Added

اضافه شدن بهبود در الگوریتم gyro consumer برای پردازش دقیق‌تر داده‌ها.

Changed

اصلاحات جزئی در ادغام شاخه‌ها و رفع مشکلات merge conflict بین main و amcollar-Feature.

Fixed

حل مشکلات مربوط به هم‌پوشانی کامیت‌ها پس از ادغام شاخه‌ها.

Merged

ادغام شاخه amcollar-Feature در amcollar-hesam-dev با رفع merge conflicts.

## [0.1.2] – 2025-12-16
Added

بهبود و توسعه پردازش Gyro در gyro_process.py.

به‌روزرسانی منطق فعالیت‌ها (activity) برای تحلیل دقیق‌تر داده‌ها.

Changed

اصلاح جریان (flow) فعالیت‌ها و ساعات مرتبط با activity hourlys.

Fixed

رفع مشکلات جریان پردازش DV-gyro-activity که باعث خطا در تحلیل داده‌ها می‌شد.

## [0.1.3] – 2025-12-20
Added

اضافه شدن جریان کامل PPG Service → VET Service → Thresholds

هنوز تست نشده، اما زیرساخت اولیه آماده است.

افزودن NGINX به پروژه برای مدیریت درخواست‌ها و روتینگ بین سرویس‌ها.

Changed

به‌روزرسانی فایل‌های docker-compose و docker-compose-pro

بهبود ساختار سرویس‌ها و هماهنگی با NGINX.

Merged

ادغام شاخه amcollar-Feature در amcollar-hesam-dev

شامل به‌روزرسانی‌ها و اصلاحات انجام‌شده در Feature Branch.

## [0.1.4] – 2025-12-21
Added

بهبود جریان PPG → Threshold

داده‌های PPG پس از دریافت در مدل جدید ذخیره می‌شوند و Threshold مطابق زمان‌بندی به‌روزرسانی می‌شود.

Changed

به‌روزرسانی Flow پردازش PPG و Threshold برای هماهنگی با مدل جدید و زمان‌بندی آپدیت.

Fixed

رفع مشکل کانفیگ NGINX

تنظیم صحیح پورت‌ها و هماهنگی با Docker Compose برای محیط توسعه و پروداکشن.