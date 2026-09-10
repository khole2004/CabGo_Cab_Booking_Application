# CabGo - Render Deployment Guide (100% Production Ready)

This guide walks you through deploying the full-stack **CabGo** application (Spring Boot 3 + React/Vite + Managed PostgreSQL) to **[Render.com](https://render.com/)**.

---

## Architecture Overview

```
                          ┌────────────────────────┐
                          │   Browser / Client     │
                          └───────────┬────────────┘
                                      │
              ┌───────────────────────┴──────────────────────┐
              │                                              │
              ▼                                              ▼
   ┌───────────────────────┐                      ┌───────────────────────┐
   │    cabgo-frontend     │                      │     cabgo-backend     │
   │  Render Static Site   │ ── API Requests ──>  │   Render Web Service  │
   │  (React 18 + Vite)    │                      │ (Docker / Java 17)    │
   └───────────────────────┘                      └───────────┬───────────┘
                                                              │
                                                              ▼
                                                  ┌───────────────────────┐
                                                  │       cabgo-db        │
                                                  │   Render PostgreSQL   │
                                                  └───────────────────────┘
```

---

## Method 1: 1-Click Blueprint Deployment (Recommended)

Render Blueprints allow you to provision the database, backend, and frontend simultaneously using the included `render.yaml`.

### Steps:

1. **Push your code to GitHub / GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **"Blueprints"** in the top navigation bar.
4. Click **"New Blueprint Instance"**.
5. Connect your repository (`web_pagenew` or your repo name).
6. Render will automatically detect `render.yaml` and display:
   - **`cabgo-db`** (PostgreSQL Database)
   - **`cabgo-backend`** (Docker Web Service)
   - **`cabgo-frontend`** (Static Site)
7. Click **"Apply"**.
8. Once the build finishes, update the frontend's `VITE_API_BASE_URL` with your actual backend URL:
   - Go to **cabgo-frontend** -> **Environment**.
   - Set `VITE_API_BASE_URL`: `https://cabgo-backend.onrender.com/api` (replace `cabgo-backend` with your specific assigned URL).
   - Trigger a manual redeploy so Vite bakes the URL into the production bundle.

---

## Method 2: Manual Dashboard Deployment

If you prefer configuring each service individually through the Render Web UI:

### Step 1: Create the Managed PostgreSQL Database

1. In Render Dashboard, click **New +** -> **PostgreSQL**.
2. Fill in the parameters:
   - **Name**: `cabgo-db`
   - **Database**: `cabgo_db`
   - **User**: `cabgo`
   - **Region**: `Oregon (US West)` (or your preferred region)
   - **Plan**: `Free`
3. Click **Create Database**.
4. Wait for it to become `Available`. Copy the **Internal Database URL** (e.g. `postgres://cabgo:***@dpg-xxx-a:5432/cabgo_db`).

---

### Step 2: Deploy the Backend Web Service

1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the service:
   - **Name**: `cabgo-backend`
   - **Region**: Same region as your database (`Oregon`)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile` (or `./backend/Dockerfile`)
   - **Docker Context**: `.` (Root)
   - **Instance Type / Plan**: `Free`
4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PORT` | `8088` | Internal port Spring Boot binds to |
   | `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL configuration |
   | `DATABASE_URL` | *(Select "Add from Database" -> `cabgo-db` -> `Internal Database URL`)* | Connection string |
   | `CORS_ALLOWED_ORIGINS` | `https://*.onrender.com,http://localhost:5173` | Allowed frontend origins |
5. In **Health Check Path**, enter:
   ```
   /api/vehicles
   ```
6. Click **Create Web Service**.
7. Note down your backend URL once live (e.g. `https://cabgo-backend.onrender.com`).

---

### Step 3: Deploy the Frontend Static Site

1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect your Git repository.
3. Configure the build:
   - **Name**: `cabgo-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://<your-backend-name>.onrender.com/api` |
5. Add **Redirect / Rewrite Rules** (to support React Router SPA navigation):
   - Go to **Settings** -> **Redirects / Rewrites**.
   - Add rule:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## Pre-Configured Demo Accounts

The application automatically seeds realistic test data on its first boot:

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **Passenger** | `ananya@example.com` | `CityRider@2025!` | Book rides, ride tracking, saved locations, promo codes |
| **Driver Partner** | `rajesh.driver@example.com` | `CityRider@2025!` | Driver Dashboard, incoming dispatch, OTP verification |
| **Administrator** | `admin@cabgo.com` | `CityRider@2025!` | System administration |

### Active Promo Codes:
- `FIRST50`: 50% discount on first ride (up to ₹100)
- `CABGO100`: Flat ₹100 discount on airport & outstation rides above ₹300
- `CITY20`: 20% discount on regular city commutes

---

## Important Render Free-Tier Tips

1. **Spin-down & Cold Starts**: Free Web Services on Render spin down after 15 minutes of inactivity. When a new request arrives, it may take 30-50 seconds for the backend container to wake up.
2. **Memory Optimization**: The backend container includes `-Xms256m -Xmx400m -XX:+UseG1GC` to safely fit within the 512MB RAM limit of Render's free tier.
3. **Database URL Transformation**: The backend contains an automatic adapter (`DatabaseConfig.java`) that automatically converts Render's `postgres://user:pass@host:port/db` connection string into the standard JDBC `jdbc:postgresql://host:port/db` format with credentials extraction.
