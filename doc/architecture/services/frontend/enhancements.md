[← Back to Frontend Documentation](./frontend.md) | [Back to Overview](../../overview.md)

# Frontend Enhancement Suggestions

Current status: **Modern Next.js 16**. Good foundation.
Goal status: **Enterprise-Grade PWA**.

---

## 1. State Management (Zustand / Jotai)
**The Problem**:
As the app grows, passing "User" or "Selected Pet" props down 10 levels of components (Prop Drilling) becomes unmanageable.
`Context API` causes unnecessary re-renders.

**Solution: Zustand**
*   Tiny, fast state manager.
*   Store global state like `usePetStore`:
    ```javascript
    const usePetStore = create((set) => ({
      selectedPetId: null,
      selectPet: (id) => set({ selectedPetId: id })
    }))
    ```
*   **Benefit**: Cleaner code, better performance.

---

## 2. Server Actions for Mutations
**The Problem**:
Using `useEffect` + `fetch` for form submissions (Login, Update Profile) is complex (loading states, error handling).

**Solution: Next.js Server Actions**
*   Write functions like `async function updateProfile(formData)` directly in the component.
*   Next.js handles the POST request, validation, and revalidation automagically.
*   **Benefit**: Zero-JS progressive enhancement, less client-side code.

---

## 3. Progressive Web App (PWA)
**The Problem**:
Users want to instal the app on their phone, but we don't have an iOS/Android Native App yet.

**Solution: PWA Manifest & Service Workers**
*   Add `manifest.json`.
*   Register a Service Worker (`next-pwa` plugin).
*   **Benefit**:
    *   "Add to Home Screen" button.
    *   **Offline Support** (cache maps and recent data).
    *   Push Notifications.

---

## 4. Component Library (Shadcn UI)
**The Problem**:
Building Modals, Dropdowns, and DatePickers from scratch is slow and bug-prone.

**Solution: Shadcn UI**
*   Copy-paste components built with Radix UI + Tailwind.
*   **Benefit**: Accessible, customizable, and looks professional instantly.
