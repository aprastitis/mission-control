# Mission Control Kanban Dashboard

A full-stack Kanban board application built with FastAPI backend and Next.js frontend.

## Features

- **Backend**: FastAPI with SQLite, Pydantic models, SQLAlchemy ORM
- **Frontend**: Next.js with TypeScript, Tailwind CSS, drag-and-drop Kanban board
- **API**: RESTful CRUD operations for tasks
- **Columns**: To Do, In Progress, Done
- **CORS**: Enabled for frontend-backend communication

## Setup

### Backend

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   python main.py
   ```
   Server runs on http://localhost:8000

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

### PM2 (Production)

Start both services:
```bash
cd backend && pm2 start ecosystem.config.js
cd ../frontend && pm2 start ecosystem.config.js
```

## API Endpoints

- `GET /api/v1/tasks` - List all tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/{id}` - Get a specific task
- `PUT /api/v1/tasks/{id}` - Update a task
- `DELETE /api/v1/tasks/{id}` - Delete a task

## Testing

Run Playwright tests:
```bash
cd frontend
npx playwright test
```

## Git History

- feat: kanban fullstack - Complete full-stack Kanban implementation