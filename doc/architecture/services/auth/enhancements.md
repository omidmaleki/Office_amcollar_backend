[← Back to Auth Documentation](./auth.md) | [Back to Overview](../../overview.md)

# Auth Enhancement Suggestions

Current status: **Functional**. It works, but it's basic.
Goal status: **Enterprise-Grade**. Secure, Fast, and Scalable.

---

## 1. Security & Performance

### A. Store OTPs in Redis (Not Database)
**Why?**
Right now, every time someone asks for an OTP, we write to the Disk (Database).
OTPs are temporary (expire in 5 mins). Writing them to a permanent DB is slow and wasteful.
**How?**
Use **Redis**.
*   **Write**: `SET otp:989123456789 "1234" EX 300` (Expires in 300s).
*   **Verify**: `GET otp:989123456789`.
*   **Result**: 10x faster validation.

### B. Rate Limiting (Anti-Spam)
**Why?**
A malicious user could write a script to request 10,000 SMS messages to a victim's phone. This costs us money (SMS fees) and annoys the victim.
**How?**
Implement strict throttling:
*   "Max 1 SMS per minute per phone."
*   "Max 5 SMS per hour from the same IP."

---

## 2. Code Quality

### A. Move Business Logic to Services
**Why?**
The `views.py` file is huge. It handles HTTP requests, DB queries, and SMS sending logic all mixed together.
**How?**
Refactor into a `services.py`:
*   `OtpService.generate_code()`
*   `OtpService.send_sms()`
*   `AuthService.login_user()`
**Result**: Views become clean and simple: "Receive Request -> Call Service -> Return Response".

---

## 3. Features

### A. Social Login (Google/Apple)
**Why?**
Typing OTPs is annoying. One-tap login increases user conversion.
**How?**
Integrate **Google Sign-In** or **Apple Sign-In**.
This requires updating the `Owner` model to support email/OAuth IDs, not just phone numbers.
