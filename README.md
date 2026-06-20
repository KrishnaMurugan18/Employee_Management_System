# Employee Management System (EMS)

A full-stack, production-style Employee Management System built with **Java 21 + Spring Boot 3** on the backend and **React 19 + Vite + Tailwind CSS** on the frontend. Built as a portfolio project to demonstrate REST API design, JWT authentication, role-based access control, and modern full-stack engineering practices.

> 🔗 Live demo: _add your deployed URLs here after deployment_
> 🔗 API docs (Swagger): `https://<your-backend-url>/api/swagger-ui.html`

---

## Why this project

This isn't a CRUD tutorial clone. It demonstrates the kind of decisions a backend/full-stack engineer makes on the job:

- Separating **authentication identity** (`User`) from **HR profile data** (`Employee`) instead of overloading one entity
- Stateless JWT auth with **access + refresh tokens**, method-level `@PreAuthorize` security, and a centralized exception handler that never leaks stack traces
- Dynamic search/filter/sort/pagination using **JPA Specifications** instead of hardcoded query methods
- An **audit log** that records who did what, async so it never slows down the request path
- DTOs at every API boundary — entities never leave the service layer
- A frontend with real loading/error states, optimistic-feeling UX (debounced search, toast feedback), JWT refresh handled transparently in an axios interceptor, and dark/light mode

---

## Tech Stack

**Backend:** Java 21 · Spring Boot 3.3 · Spring Security · Spring Data JPA · PostgreSQL · JWT (jjwt) · Bean Validation · Apache POI (Excel export) · springdoc-openapi (Swagger) · Maven · Lombok

**Frontend:** React 19 · Vite · React Router 6 · Axios · Tailwind CSS · Recharts · Lucide Icons · react-hot-toast

**Database:** PostgreSQL with proper FK relationships, indexes on searchable columns, and seed data

---

## Architecture

```
┌─────────────────┐        HTTPS / JSON         ┌──────────────────────┐        JDBC        ┌──────────────┐
│   React (SPA)    │ ───────────────────────────▶ │   Spring Boot REST    │ ──────────────────▶ │  PostgreSQL   │
│  Vercel / Netlify │ ◀─────────────────────────── │   API (Render/Railway)│ ◀────────────────── │ (hosted)      │
└─────────────────┘        JWT in header          └──────────────────────┘                      └──────────────┘
                                                              │
                                                              ▼
                                                     Local disk /uploads
                                                    (profile images, static)
```

**Backend layering:** `Controller → Service → Repository`, with DTOs converting at the controller/service boundary via dedicated `mapper` classes. Security is enforced both at the URL level (`SecurityConfig`) and the method level (`@PreAuthorize`) for defense in depth.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full breakdown and [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) for the ER diagram.

---

## Project Structure

```
employee-management-system/
├── ems-backend/                 # Spring Boot REST API
│   ├── src/main/java/com/krishna/ems/
│   │   ├── config/              # Security, CORS, OpenAPI, JPA auditing, data seeding
│   │   ├── controller/          # REST endpoints
│   │   ├── dto/request/         # Input DTOs with Bean Validation
│   │   ├── dto/response/        # Output DTOs
│   │   ├── entity/              # JPA entities
│   │   ├── exception/           # Custom exceptions + GlobalExceptionHandler
│   │   ├── mapper/               # Entity ↔ DTO conversion
│   │   ├── repository/          # Spring Data JPA repositories + Specifications
│   │   ├── security/            # JWT util, filter, UserDetailsService
│   │   └── service/             # Business logic (interface + impl)
│   ├── src/main/resources/application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── ems-frontend/                # React SPA
│   ├── src/
│   │   ├── api/                 # Axios client + per-resource API modules
│   │   ├── components/          # layout, ui, employee, department, dashboard
│   │   ├── context/              # Auth + Theme context providers
│   │   ├── hooks/                # useDebounce, etc.
│   │   ├── pages/                # auth, admin, employee route pages
│   │   └── routes/               # ProtectedRoute (auth + role guard)
│   └── vite.config.js
│
└── docs/
    ├── ARCHITECTURE.md
    ├── DATABASE_SCHEMA.md
    ├── API_DOCUMENTATION.md
    └── DEPLOYMENT_GUIDE.md
```

---

## Core Features

**Authentication & Security**
- Register / Login with JWT access + refresh tokens
- BCrypt password hashing, role-based access control (`ADMIN`, `EMPLOYEE`)
- Stateless sessions, CORS locked to configured frontend origin
- Centralized validation + error handling (no raw stack traces ever returned)

**Admin**
- Dashboard: total/active/inactive employees, department distribution, 6-month growth chart, recent activity feed
- Employee CRUD with server-side search, department/status filters, column sorting, pagination
- Department management (create/edit/delete, blocked if employees are still assigned)
- Export filtered employee list to Excel (`.xlsx`)
- Audit log viewer (every create/update/delete/login is recorded)

**Employee (self-service)**
- View and edit own profile (name, phone)
- Upload profile picture
- Change password

**UX**
- Responsive sidebar + topbar layout (mobile-first)
- Dark/light mode with persisted preference
- Toast notifications, loading states, debounced search, confirm-before-delete dialogs

---

## Getting Started Locally

### Prerequisites
- Java 21, Maven 3.9+
- Node.js 18+
- PostgreSQL 14+ (or use Docker)

### 1. Database
```bash
createdb ems_db
# or with Docker:
docker run --name ems-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ems_db -p 5432:5432 -d postgres:16
```

### 2. Backend
```bash
cd ems-backend
cp .env.example .env   # edit DB credentials if needed
mvn spring-boot:run
```
The API starts at `http://localhost:8080/api`. On first run it seeds:
- Admin: `admin@ems.com` / `Admin@123`
- 5 departments and 8 sample employees

Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### 3. Frontend
```bash
cd ems-frontend
cp .env.example .env   # set VITE_API_BASE_URL if not localhost
npm install
npm run dev
```
App runs at `http://localhost:5173`.

---

## Deployment

Full step-by-step instructions (Render/Railway for backend, Vercel/Netlify for frontend, Neon/Supabase for hosted Postgres) are in [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md).

---

## API Documentation

Full endpoint reference is in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md), and an interactive version is auto-generated by springdoc at `/api/swagger-ui.html` once the backend is running.

---

## Author

**Krishna** — Graduate Engineering Trainee, Cybersecurity & Cloud/DevOps @ HCLTech · B.Tech IT, KLN College of Engineering · Google Cloud Associate Cloud Engineer

Built as a portfolio project to demonstrate full-stack engineering with Java/Spring Boot and React.
