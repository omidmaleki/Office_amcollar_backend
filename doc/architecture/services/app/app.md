[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# App Frontend Documentation

## Introduction
The **App Frontend** is the client-facing application designed primarily for **Pet Owners** (and Vets).
It is built as a **Progressive Web App (PWA)** using Next.js.
While it runs in the browser, it is designed to look and feel like a native mobile app (iOS/Android).

**Target Audience**:
1.  **Pet Owners**: To track their pet, see health stats, and receive alerts.
2.  **Veterinarians**: To view patient data and medical records.

---

## 1. Key Modules

### A. Owner Dashboard (`/owner`)
The personalized home screen for a pet owner.
*   **Map View**: Shows the pet's real-time location.
*   **Pet Cards**: Quick summary of each pet (Battery level, Activity status).
*   **Health Charts**: Graphs for Heart Rate and Activity.

### B. Vet Dashboard (`/vet`)
The professional view for doctors.
*   **Patient List**: Searchable list of assigned pets.
*   **Medical Records**: Interface to upload X-Rays and write notes.

### C. Role Selection (`/role-select`)
Since the same app serves both Owners and Vets, this screen directs the user to the correct dashboard after login.

---

## 2. PWA Features (Mobile Experience)
This app is designed to be "Installed" on the user's phone.
*   **Responsive Design**: Mobile-first UI (Touch-friendly buttons, Bottom Navigation).
*   **Manifest**: Allows adding to the Home Screen with a custom Icon and Name ("AmCollar").
*   **Service Worker**: Caches assets for faster loading on 4G/3G networks.

---

## 3. Technology Stack
*   **Framework**: Next.js 16 (App Router).
*   **State Management**: React Hooks (State/Effect).
*   **Maps**: Mapbox GL JS.
*   **Icons**: Lucide React.
*   **Styling**: Tailwind CSS (with bespoke mobile utilities).
