# Event Management Frontend

Simple React (Vite) frontend for the existing Node/Express backend. No backend code was changed.

## Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:3000
Backend must be running at http://localhost:5000 (see `.env` -> VITE_API_BASE_URL to change).

## Roles

- **ADMIN**: /admin — create, edit, delete events
- **STUDENT**: /student — browse events, register, view/cancel own registrations
- **FACULTY**: /faculty — view event summary, students-by-event, and student summary reports

Register a user first via the Register page and choose the role, then log in.

## Folder Structure

```
src/
  api/axios.js          -> axios instance + token/error interceptors
  context/AuthContext.jsx -> login/register/logout + auth state
  components/
    Navbar.jsx
    ProtectedRoute.jsx   -> route guard (auth + role check)
  pages/
    Home.jsx
    Login.jsx
    Register.jsx
    AdminDashboard.jsx
    StudentDashboard.jsx
    FacultyDashboard.jsx
    Unauthorized.jsx
    NotFound.jsx
  App.jsx
  main.jsx
```
