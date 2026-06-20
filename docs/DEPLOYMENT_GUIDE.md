# Deployment Guide

This deploys: **PostgreSQL** (Neon, free tier) → **Backend** (Render, free tier) → **Frontend** (Vercel, free tier). Railway/Netlify work the same way with equivalent steps.

---

## 1. Hosted PostgreSQL (Neon)

1. Create a free account at [neon.tech](https://neon.tech) and create a new project.
2. Copy the connection string. It looks like:
   ```
   postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
   ```
3. Convert it to a Spring-compatible JDBC URL:
   ```
   DB_URL=jdbc:postgresql://<host>/<dbname>?sslmode=require
   DB_USERNAME=<user>
   DB_PASSWORD=<password>
   ```

---

## 2. Backend (Render)

1. Push `ems-backend/` to a GitHub repository.
2. On [render.com](https://render.com) → **New → Web Service** → connect your repo.
3. Settings:
   - **Root directory**: `ems-backend`
   - **Runtime**: Docker (Render detects the included `Dockerfile`)
   - **Instance type**: Free
4. Add environment variables (Render dashboard → Environment):
   ```
   DB_URL=jdbc:postgresql://<neon-host>/<dbname>?sslmode=require
   DB_USERNAME=<neon-user>
   DB_PASSWORD=<neon-password>
   DDL_AUTO=update
   JWT_SECRET=<generate a new 256-bit base64 string>
   JWT_ACCESS_EXPIRY=3600000
   JWT_REFRESH_EXPIRY=604800000
   ALLOWED_ORIGINS=https://<your-frontend-domain>.vercel.app
   ADMIN_EMAIL=admin@ems.com
   ADMIN_PASSWORD=<set a real password>
   UPLOAD_DIR=/app/uploads/profile-images
   ```
   Generate a JWT secret with: `openssl rand -base64 32`
5. Deploy. Render builds the Docker image and starts the service.
6. Verify by visiting `https://<your-backend>.onrender.com/api/swagger-ui.html`.

> **Note on free-tier storage**: Render's free tier has an ephemeral filesystem — uploaded profile images won't survive a redeploy. For true production use, swap `FileStorageServiceImpl` for a cloud storage provider (S3, Cloudinary). For a portfolio demo this is an acceptable, explainable tradeoff.

### Railway alternative
Same environment variables. Railway auto-detects the `Dockerfile`; set variables under the **Variables** tab and deploy from the connected GitHub repo.

---

## 3. Frontend (Vercel)

1. Push `ems-frontend/` to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Settings:
   - **Root directory**: `ems-frontend`
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Environment variable:
   ```
   VITE_API_BASE_URL=https://<your-backend>.onrender.com/api
   ```
5. Deploy. The included `vercel.json` handles SPA routing fallback.
6. Copy your Vercel URL and update `ALLOWED_ORIGINS` on the backend (Render) to match it exactly, then redeploy the backend.

### Netlify alternative
- Build command: `npm run build`, publish directory: `dist`
- `public/_redirects` (already included) handles SPA routing
- Set `VITE_API_BASE_URL` under Site settings → Environment variables

---

## 4. Post-deploy checklist

- [ ] Visit the frontend URL, log in with the seeded admin account, confirm the dashboard loads
- [ ] Create a test employee, confirm it appears in the list and dashboard stats update
- [ ] Test the Excel export download
- [ ] Test profile image upload
- [ ] Confirm CORS is locked to your actual frontend domain (not `*`)
- [ ] Change the default admin password from the seeded one
- [ ] Rotate `JWT_SECRET` to a freshly generated value — don't use the one in `.env.example`

---

## Local Docker Compose (optional, for local full-stack testing)

```yaml
# docker-compose.yml (place at repo root)
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ems_db
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  backend:
    build: ./ems-backend
    environment:
      DB_URL: jdbc:postgresql://db:5432/ems_db
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      ALLOWED_ORIGINS: http://localhost:5173
    ports: ["8080:8080"]
    depends_on: [db]

volumes:
  pgdata:
```
Run with `docker compose up --build`, then run the frontend separately with `npm run dev`.
