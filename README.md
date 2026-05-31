# HabitFlow

HabitFlow is a full-stack habit tracker that helps users build consistent routines. Users can sign up, create habits (e.g. “Exercise”, “Read”, “Meditate”), and log whether they completed those habits each day. A simple “Today” view shows all habits for the current day and lets users quickly mark them as done or missed.

---

## Features

- User authentication (JWT-based)
  - Sign up, log in, persistent auth via token
  - Only see and modify your own data
- Habits
  - Create, read, update, delete your habits
  - Each habit has a name, category, and target per week
- Habit entries
  - Log whether you completed a habit on a given day
  - “Today” view that shows all your habits and their status for today
  - Quick actions to mark a habit as “done” or “missed”
- Frontend
  - React + Vite
  - Auth-aware navigation (login/logout, protected routes)
  - Simple, responsive UI themed with an olive / light-green color palette

---

## Tech Stack

**Backend**
- Python, Flask
- Flask SQLAlchemy
- Flask-Migrate (Alembic)
- Flask-JWT-Extended
- Flask-Bcrypt
- Flask-CORS
- Marshmallow
- PostgreSQL

**Frontend**
- React (Vite)
- React Router
- Fetch API for HTTP requests
- Vanilla CSS (with CSS variables for theming)

---

## Project Structure

```text
HabitFlow/
  server/
    app.py
    config.py
    models/
      __init__.py
      user.py
      habits.py
      habit_entry.py
    routes/
      auth.py
      habits.py
    schemas/
      __init__.py
      user_schema.py
      habit_schema.py
      habit_entry_schema.py
  client/
    index.html
    vite.config.[js|ts]
    src/
      main.jsx
      App.jsx
      api.js
      auth.jsx
      components/
        NavBar.jsx
      pages/
        LoginPage.jsx
        SignupPage.jsx
        HabitsPage.jsx
        TodayPage.jsx
  migrations/
    ... Alembic migration files ...
  Pipfile
  README.md
```

## Getting Started

Prerequisites:
- Python 3.11+
- Node.js + npm
- PostgreSQL (running locally on port 5432)
- pipenv installed globally
