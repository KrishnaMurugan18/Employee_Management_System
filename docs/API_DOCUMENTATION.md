# API Documentation

Base URL (local): `http://localhost:8080/api`
Interactive Swagger UI: `/swagger-ui.html` · OpenAPI JSON: `/v3/api-docs`

All responses follow this envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```
Errors follow:
```json
{ "status": 400, "error": "Bad Request", "message": "...", "path": "/api/...", "timestamp": "...", "validationErrors": { "field": "reason" } }
```

Authenticated endpoints require `Authorization: Bearer <accessToken>`.

---

## Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new employee account |
| POST | `/auth/login` | Public | Login, returns access + refresh tokens |
| POST | `/auth/refresh` | Public | Exchange refresh token for new token pair |

**POST `/auth/register`**
```json
{ "firstName": "Asha", "lastName": "Rao", "email": "asha@ems.com", "password": "Pass@123", "phoneNumber": "+91-90000-00001" }
```

**POST `/auth/login`**
```json
{ "email": "admin@ems.com", "password": "Admin@123" }
```
Response `data`: `{ accessToken, refreshToken, tokenType: "Bearer", email, role, fullName }`

---

## Employees

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/employees` | ADMIN | Search/filter/sort/paginate employees |
| POST | `/employees` | ADMIN | Create employee |
| GET | `/employees/{id}` | Authenticated | Get employee by id |
| PUT | `/employees/{id}` | ADMIN | Update employee |
| DELETE | `/employees/{id}` | ADMIN | Delete employee |
| GET | `/employees/me` | Authenticated | Get my own profile |
| PUT | `/employees/me` | Authenticated | Update my own profile (name, phone) |
| POST | `/employees/{id}/profile-image` | Authenticated | Upload profile picture (multipart) |
| GET | `/employees/export` | ADMIN | Export filtered list as `.xlsx` |

**GET `/employees`** query params: `search`, `departmentId`, `status` (`ACTIVE`/`INACTIVE`), `page` (0-indexed), `size`, `sortBy`, `sortDir` (`asc`/`desc`)

**POST `/employees`**
```json
{
  "firstName": "Asha", "lastName": "Rao", "email": "asha@ems.com",
  "phoneNumber": "+91-90000-00001", "departmentId": 1,
  "designation": "Backend Developer", "salary": 90000,
  "joiningDate": "2026-01-15", "status": "ACTIVE"
}
```

---

## Departments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/departments` | Authenticated | List all departments |
| POST | `/departments` | ADMIN | Create department |
| PUT | `/departments/{id}` | ADMIN | Update department |
| DELETE | `/departments/{id}` | ADMIN | Delete (blocked if employees assigned) |

---

## Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | ADMIN | Total/active/inactive counts, department distribution, 6-month growth, recent activity |

---

## Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/users/change-password` | Authenticated | Change own password |

```json
{ "currentPassword": "Old@123", "newPassword": "New@1234" }
```

---

## Audit Logs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/audit-logs?limit=50` | ADMIN | Most recent activity entries |

---

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error / bad request |
| 401 | Missing, invalid, or expired token |
| 403 | Authenticated but not authorized for this action |
| 404 | Resource not found |
| 409 | Duplicate resource (email/department name already exists) |
| 413 | Uploaded file exceeds 5MB |
| 500 | Unexpected server error (logged server-side, generic message returned) |
