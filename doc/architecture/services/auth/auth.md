[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Auth Service Documentation

## Introduction
The **Auth Service** is the "ID Card Office" of AmCollar.
It handles **Who you are** (Authentication) and **What you can do** (Authorization).
Unlike traditional apps that use Email/Password, AmCollar uses **Phone Number + OTP (One-Time Password)**.

---

## 1. Core Concepts

### The "Owner" Model
In our system, a User is called an **Owner**.
*   **Identifier**: Phone Number (Unique).
*   **Role**: `owner` (Regular user), `vet` (Veterinarian), or `admin`.
*   **Authentication**: No passwords! We only use OTP codes.

### The "Passport" (JWT)
When you log in, we give you two tokens (like a specialized Passport):
1.  **Access Token**: Short-lived (e.g., 1 hour). You show this to the Gateway to get into `/pets/` or `/orders/`.
2.  **Refresh Token**: Long-lived (e.g., 2 weeks). You use this to get a new Access Token without logging in again.

---

## 2. The Login Flow

### Step 1: Send OTP
**User says**: "Hi, my phone is +989123456789."
**API**: `POST /auth/otp/send/`
**What happens**:
1.  Auth Service generates a random 4-digit code (e.g., `1234`).
2.  It hashes the code and saves it in the DB (Safety first!).
3.  It calls the **SMS Service** (via Gateway) to text the code to the user.

### Step 2: Verify OTP
**User says**: "I got code 1234."
**API**: `POST /auth/otp/verify/`
**What happens**:
1.  Auth Service checks if the code matches the hash in DB.
2.  Checks if it's expired (5 minutes limit).
3.  **Success**: It creates (or finds) the Owner and returns the JWT Tokens.

---

## 3. Technical Details
*   **Framework**: Django Rest Framework (DRF) + SimpleJWT.
*   **Database**: Uses `db.sqlite3` (Local) or PostgreSQL (Prod).
*   **Internal Communication**:
    *   Talks to **SMS Service** to send text messages.
    *   **External Service** (Gateway) talks to it to validate tokens.

---

## 4. Common Issues
**"I'm not getting the SMS!"**
1.  Check **SMS Service** logs. Is it running?
2.  Check **Gateway** logs. Can Auth Service reach the SMS Service?
    *   *Dev Note*: In local development, the OTP code is often printed in the `docker logs amcollar-auth` console if the SMS provider isn't configured.

**"Token is invalid!"**
*   The Access Token might be expired. Use the Refresh Token to get a new one.
