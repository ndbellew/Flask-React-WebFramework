# Flask + Vite Web Application Framework

A containerized full-stack web application framework built with a Flask REST backend, PostgreSQL database, and Vite-powered React frontend.

The project provides a working foundation for applications that require user authentication, protected routes, role-based access control, database persistence, API security, frontend routing, automated testing, and CI quality checks.

The application is designed to run primarily through Docker Compose so the backend, frontend, and database can be started together with a single command.

---

## What Does This Application Do?

The current application provides:

* User registration
* User login
* JWT-based authentication
* Access and refresh token support
* Token refresh when access tokens expire
* Token revocation support for logout
* Role-based authorization
* Admin-only frontend routes
* Protected user profile routes
* CSRF protection
* PostgreSQL-backed user persistence
* Vite-powered React frontend
* Flask REST API backend
* Dockerized frontend, backend, and database
* Automated backend and frontend testing
* Code formatting and linting
* Test coverage enforcement
* Dependency auditing
* GitHub Actions CI

The repository is intended to serve as a reusable full-stack application foundation. Additional application-specific domains and APIs can be built on top of the existing authentication, database, frontend, and testing infrastructure.

---

# Getting Started

## Requirements

The easiest way to run the project is with Docker.

You will need:

* Docker
* Docker Compose

You do not need to manually install Python, PostgreSQL, Node.js, or project dependencies when running the complete application through Docker Compose.

---

## Start the Application

From the root of the repository:

```bash
docker compose up --build
```

Docker Compose builds and starts:

* Flask backend
* Vite frontend
* PostgreSQL database

The database service includes a health check, and the backend waits for PostgreSQL to become healthy before starting.

### Application Ports

| Service                 |   Port |
| ----------------------- | -----: |
| Flask backend           | `5000` |
| Vite development server | `5173` |
| Vite preview server     | `4173` |
| PostgreSQL              | `5432` |

The frontend can normally be accessed at:

```text
http://localhost:5173
```

The backend can normally be accessed at:

```text
http://localhost:5000
```

---

# Environment Configuration

The Docker Compose configuration expects environment files for the application services.

```text
backend/.env
frontend/.env
config/database.env
```

Example configuration files should be used as templates where provided.

Sensitive production values should never be committed directly into the repository.

Important backend configuration includes:

* `SECRET_KEY`
* `JWT_SECRET_KEY`
* `DATABASE_URL`
* `CORS_ORIGINS`

The application contains development fallback values for some configuration options, but those values should not be used in production.

---

# Technology Stack

## Backend

The backend is written in Python using Flask.

Primary backend technologies include:

* Python
* Flask
* Flask-SQLAlchemy
* PostgreSQL
* Psycopg
* Flask-Migrate
* Flask-JWT-Extended
* Flask-WTF
* Flask-CORS
* uv

### Backend Responsibilities

The Flask application handles:

* REST API routing
* User authentication
* JWT issuance and validation
* Refresh tokens
* Token revocation
* Role-based authorization
* CSRF generation and validation
* Database access
* User persistence
* API error responses

The backend uses an application-factory structure and initializes Flask extensions separately from application logic.

---

## Frontend

The frontend is built with Vite and React.

Primary frontend technologies include:

* Vite
* React
* React Router
* Bootstrap
* JavaScript / JSX
* Vitest
* React Testing Library
* ESLint
* Prettier

Vite is responsible for the frontend development server, build process, and test integration.

### Frontend Responsibilities

The frontend currently provides:

* Home page
* Login page
* Registration page
* User profile page
* Admin dashboard
* About page
* Contact page
* Protected client-side routes
* Authentication-aware navigation
* Token refresh handling
* CSRF-aware API requests

---

## Database

PostgreSQL is used as the primary database when running the Docker Compose environment.

The PostgreSQL database runs in its own container and stores its data in a persistent Docker volume:

```text
postgres-data
```

This allows database data to survive container restarts.

SQLAlchemy provides the backend ORM layer.

---

# Authentication

Authentication is implemented using JSON Web Tokens through Flask-JWT-Extended.

Successful login returns two tokens:

* Access token
* Refresh token

### Access Token

Access tokens expire after:

```text
15 minutes
```

They are used to authenticate normal protected API requests.

Example header:

```http
Authorization: Bearer <access_token>
```

### Refresh Token

Refresh tokens expire after:

```text
30 days
```

They are used to obtain a new access token when the current access token expires.

The frontend contains token-refresh logic that can retry the original API request after successfully receiving a replacement access token.

---

# Authorization

The application currently supports user roles.

A role is stored as a JWT claim and can be used for authorization decisions.

The frontend distinguishes between:

* Authenticated users
* Unauthenticated users
* Administrative users

For example:

```text
/admin/dashboard
```

requires both authentication and administrator privileges.

Protected routes prevent unauthenticated users from accessing restricted frontend pages.

---

# User Registration

New users can create an account through the registration page.

The frontend submits:

```json
{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "example-password"
}
```

to:

```http
POST /register
```

Registration creates the user in the database and returns a successful `201 Created` response.

Usernames and email addresses are normalized before they are stored.

---

# API

The Flask backend currently exposes authentication, user, security, and utility endpoints.

## Authentication and User Endpoints

### Register

```http
POST /register
```

Creates a new user account.

Example request:

```json
{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "example-password"
}
```

Successful response:

```http
201 Created
```

---

### Login

```http
POST /login
```

Authenticates a user.

Example request:

```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```

Successful responses include:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "role": "user"
}
```

---

### Validate Current Authentication

```http
POST /auth/me
```

Requires a valid access token.

Returns information about the authenticated session, including:

* Validation status
* User ID
* Username
* Role

---

### Current User

```http
GET /me
```

Requires authentication.

Returns information about the currently authenticated user.

Example response:

```json
{
  "id": 1,
  "username": "exampleuser",
  "email": "user@example.com",
  "role": "user",
  "created_at": "..."
}
```

---

### User Profile

```http
GET /profile/<username>
```

Requires authentication.

Returns profile information for the requested username.

---

### Refresh Access Token

```http
POST /refresh
```

Requires a valid refresh token.

Returns a new access token.

---

### Logout

```http
POST /logout
```

Revokes a token identifier so the token can no longer be treated as valid by protected JWT endpoints.

The backend maintains revoked token identifiers and checks them during JWT validation.

---

# Utility and Security Endpoints

### Get CSRF Token

```http
GET /get-csrf-token
```

Returns a CSRF token for frontend requests that require CSRF protection.

Example response:

```json
{
  "csrf_token": "..."
}
```

---

### Protected Test Endpoint

```http
GET /protected
```

Requires a valid access token.

This endpoint can be used to verify that JWT authentication is functioning correctly.

---

### Server Time

```http
GET /time
```

Returns the current server time.

This endpoint is primarily retained as a simple frontend/backend communication example.

---

# Frontend Authentication Flow

When the frontend starts, it checks whether an access token exists.

If a token exists, the frontend validates the current session through:

```http
POST /auth/me
```

Protected routes are not rendered until initial authentication validation has completed.

This prevents a valid authenticated user from briefly being treated as logged out while the token validation request is still running.

The navigation bar also changes depending on authentication state.

### Logged Out

Users can access:

* Home
* Login
* Register
* About
* Contact

### Logged In

Users can access:

* Home
* Profile
* About
* Contact

Administrative users additionally receive access to:

* Admin Dashboard

---

# Project Structure

A simplified repository structure is shown below.

```text
.
├── backend/
│   ├── Dockerfile
│   ├── migrations/
│   ├── pyproject.toml
│   ├── tests/
│   ├── uv.lock
│   └── src/
│       └── api/
│           ├── app/
│           │   ├── __init__.py
│           │   ├── routes.py
│           │   └── user.py
│           ├── auth/
│           ├── decorators/
│           ├── models/
│           ├── utils/
│           ├── config.py
│           └── extensions.py
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.*
│   └── src/
│       ├── components/
│       │   ├── navigations/
│       │   └── pages/
│       ├── layout/
│       ├── utils/
│       ├── App.jsx
│       └── AuthContext.jsx
│
├── config/
│   └── database.env
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── compose.yaml
└── README.md
```

---

# Testing

Both the backend and frontend include automated tests.

## Backend Tests

Backend testing uses pytest.

From the `backend` directory:

```bash
uv run pytest
```

The backend also supports coverage through pytest-cov.

---

## Frontend Tests

Frontend testing uses Vitest and React Testing Library.

From the `frontend` directory:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run the complete coverage suite:

```bash
npm run test:coverage
```

Frontend tests cover behavior including:

* Authentication state
* User login
* User registration
* Profiles
* Protected routes
* Admin authorization
* Navigation visibility
* Token refresh
* CSRF-related application behavior
* Application routing

Tests are generally colocated with the components they test.

Example:

```text
Login.jsx
Login.test.jsx
```

---

# Coverage

Vitest uses the V8 coverage provider.

The frontend CI enforces minimum coverage thresholds for:

* Statements
* Branches
* Functions
* Lines

The current project target is:

```text
85%
```

Coverage reports are generated in text, HTML, and LCOV formats.

To generate a local coverage report:

```bash
npm run test:coverage
```

Generated reports are written to the coverage directory.

---

# Code Quality

The project uses separate tooling for code correctness, formatting, testing, and dependency security.

## Backend

### Ruff

Ruff performs Python linting:

```bash
uv run ruff check .
```

Ruff also checks formatting:

```bash
uv run ruff format --check .
```

To automatically format backend code:

```bash
uv run ruff format .
```

### pytest

```bash
uv run pytest
```

---

## Frontend

### ESLint

ESLint checks JavaScript and JSX code quality:

```bash
npm run lint
```

### Prettier

Prettier handles frontend formatting.

Check formatting:

```bash
npm run format:check
```

Automatically format the frontend:

```bash
npm run format
```

### Vitest

```bash
npm run test:coverage
```

### Vite Production Build

```bash
npm run build
```

### npm Audit

Dependency vulnerabilities can be checked with:

```bash
npm audit --audit-level=high
```

---

# Continuous Integration

GitHub Actions runs automatically on:

```text
push
pull_request
```

The workflow contains separate backend and frontend jobs.

## Backend CI

The backend job performs:

1. Repository checkout
2. uv installation
3. Python installation
4. Lockfile validation
5. Dependency installation
6. Ruff linting
7. Ruff formatting check
8. pytest test suite

## Frontend CI

The frontend job performs:

1. Repository checkout
2. Node.js setup
3. `npm ci`
4. ESLint
5. Prettier formatting check
6. Vitest tests with coverage
7. Vite production build
8. npm dependency audit

Any failing quality gate causes the CI job to fail.

---

# Security

Several security mechanisms are built into the application foundation.

## Password Handling

Passwords are not stored directly.

The backend stores password hashes and validates submitted passwords against those hashes during login.

---

## JWT Authentication

Protected API routes use Flask-JWT-Extended.

JWT access tokens are short-lived, while refresh tokens allow sessions to continue without requiring the user's credentials again.

JWT validation occurs before protected backend endpoints are executed.

---

## Token Revocation

The backend includes revoked-token persistence.

Revoked JWT identifiers can be rejected during future authentication checks, allowing tokens to be invalidated before their normal expiration time.

---

## CSRF Protection

Flask-WTF provides CSRF protection.

The frontend retrieves a CSRF token from the backend and sends the token with applicable requests through:

```http
X-CSRFToken: <token>
```

---

## CORS

Flask-CORS restricts frontend access according to configured allowed origins.

Allowed origins should be explicitly configured for production deployments.

---

## Secrets

Development fallback secrets exist to make local setup easier.

Production deployments must supply strong values for:

```text
SECRET_KEY
JWT_SECRET_KEY
```

Secrets should be provided through environment configuration and must not be committed to source control.

---

# Local Development Without Docker

Docker Compose is the recommended development path, but each application layer can also be run independently.

## Backend

From:

```bash
cd backend
```

Install dependencies:

```bash
uv sync
```

Run the configured Flask application using the project's backend development configuration.

Backend dependencies and Python versions are managed through `uv` and `pyproject.toml`.

---

## Frontend

From:

```bash
cd frontend
```

Install dependencies:

```bash
npm ci
```

Start Vite:

```bash
npm run dev
```

The default Vite development server runs on:

```text
http://localhost:5173
```

---

# Database Migrations

Flask-Migrate is included for managing SQLAlchemy database schema migrations.

Migration files are stored in:

```text
backend/migrations/
```

Schema changes should be managed through migrations rather than manually altering production tables.

---

# Design Choices

## Docker First

Docker Compose is the primary startup path because it creates a predictable development environment and keeps Python, Node, and PostgreSQL dependencies isolated from the host system.

## PostgreSQL

PostgreSQL was selected as the persistent relational database because the application contains strongly related entities such as users, roles, authentication state, and future application resources.

## Flask

Flask provides a lightweight REST backend without forcing a large application structure. Extensions can be added as the application grows while keeping routing and services explicit.

## Vite

Vite provides the frontend development server, React build tooling, test integration, and fast local development without the additional abstraction of older React scaffolding systems.

## JWT Authentication

JWTs allow the backend API to authenticate requests independently of frontend routing.

Short-lived access tokens reduce the useful lifetime of a compromised access token, while refresh tokens support longer-lived sessions.

## Separate Linting and Formatting

Code-quality responsibilities are deliberately separated:

```text
Backend:
Ruff → linting and formatting
pytest → tests

Frontend:
ESLint → code quality
Prettier → formatting
Vitest → tests
Vite → production build
```

This keeps each tool responsible for the job it performs best.

---

# Current Scope

The current branch provides the application framework, authentication system, frontend routing, database foundation, and testing infrastructure.

Application-specific domain functionality can now be added on top of this base without rebuilding authentication, user management, persistence, CI, or frontend infrastructure.

---

# License

This project is licensed under the MIT License.
