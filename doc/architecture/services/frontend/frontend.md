[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Frontend Service Documentation (`amcollarapp`)

## Introduction
The **Frontend Service** is the main User Interface for the AmCollar platform.
It is a **Next.js 16** application using the **App Router** and **Server Components**.
It serves as the dashboard for Pet Owners to track their pets' location and health, and for Vets/Admins to manage the system.

**Key Technologies**:
*   **Framework**: Next.js 16 (React 19).
*   **Styling**: Tailwind CSS v4.
*   **Maps**: Mapbox GL JS (for tracking pets).
*   **Charts**: Recharts (for health telemetry).
*   **Internationalization**: `next-intl` (Supports English, Persian, etc.).

---

## 1. Project Structure
The project follows the modern Next.js 13+ **App Directory** structure (`src/app`).

```text
amcollarapp/
├── src/
│   ├── app/
│   │   ├── [locale]/       # Dynamic Locale Route (en, fa)
│   │   │   ├── dashboard/  # User Dashboard (Protected)
│   │   │   ├── login/      # Authentication Pages
│   │   │   └── page.tsx    # Home Page
│   │   └── api/            # Next.js API Routes (Proxy to Backend)
│   ├── components/         # Reusable UI Components (Buttons, Maps)
│   ├── lib/                # Utilities (Fetch wrappers, Auth logic)
│   └── middleware.ts       # Route Protection & Locale redirection
```

---

## 2. Key Features

### A. Real-time Map Tracking
*   Uses **Mapbox GL**.
*   Subscribes to **WebSocket** (or polls API) to show the Pet's live location.
*   Displays **Geofences** (Safe Zones) as polygons on the map.

### B. Health Dashboard
*   Uses **Recharts** to visualize:
    *   Heart Rate (BPM) over time.
    *   Activity Levels (Rest, Run, Play).
*   Fetches data from the **Vet Service** or **Process Server**.

### C. Authentication
*   Uses **JWT** (JSON Web Tokens).
*   Stores tokens in **HttpOnly Cookies** (via Server Actions or Middleware) for security.
*   Middleware protects `/dashboard` routes from unauthenticated users.

---

## 3. Data Fetching
*   **Server Components**: Fetch data directly from Backend APIs (`http://gateway:8000/`) on the server side.
*   **Client Components**: Use SWR or React Query (or `useEffect`) for live updates on the client side.

---

## 4. Internationalization (i18n)
*   The entire app is wrapped in `[locale]` dynamic route.
*   `middleware.ts` detects the user's browser language and redirects to `/en` or `/fa`.
*   Translations are stored in `messages/en.json`.
