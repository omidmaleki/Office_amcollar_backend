[← Back to App Documentation](./app.md) | [Back to Overview](../../overview.md)

# App Frontend Enhancement Suggestions

Current status: **Responsive Website**.
Goal status: **Native Companion App**.

---

## 1. Native Wrapper (Capacitor / Expo)
**The Problem**:
A PWA is great, but it can't access **Bluetooth** (for initial collar setup) or **Background Geolocation** (to track the Owner's phone relative to the Pet).
Also, users trust the App Store / Play Store more than a website.

**Solution: Capacitor**
*   Wrap the Next.js app in **Capacitor**.
*   Deploy to **Apple App Store** and **Google Play Store**.
*   **Benefit**: Access to native APIs (Bluetooth, Push Notifications, Camera for QR scanning).

---

## 2. Offline Mode (Local-First Architecture)
**The Problem**:
If the Owner is hiking in the mountains (bad signal) and wants to check the pet's last known location, the app might show a "No Internet" dinosaur.

**Solution: Local Storage / IndexedDB**
*   Cache the "Last Known Location" and "Recent Health Data" on the phone.
*   When opening the app without internet, show the cached data with a "Last updated: 2 hours ago" label.
*   **Benefit**: Assurance and utility even in dead zones.

---

## 3. Push Notifications (FCM)
**The Problem**:
Currently, Alerts (Heart Rate High!) are likely sent via SMS.
SMS costs money and isn't a rich experience.

**Solution: Firebase Cloud Messaging (FCM)**
*   Implement Push Notifications.
*   "🚨 **Danger!** Max's Heart Rate is 180bpm!" (Tap to open Map).
*   **Benefit**: Free, instant, and actionable.
