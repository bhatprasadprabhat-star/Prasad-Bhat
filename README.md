# AutoFlow AI

AutoFlow AI is a full-stack AI-powered automation SaaS for business workflows: WhatsApp replies, lead capture, email responses, social auto-posting (webhook-style), and follow-up scheduling.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion
- **Backend:** Node.js + Express
- **Database:** JSON datastore (local dev) with structure ready for Supabase/Firebase migration
- **AI:** OpenAI API (with mock fallback)
- **Auth:** JWT-based auth with plan enforcement

## Folder Structure

```text
.
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── workflows
│   │   ├── leads
│   │   └── settings
│   ├── components
│   └── lib
├── backend
│   └── src
│       ├── routes
│       ├── middleware
│       ├── services
│       └── data
└── package.json (workspaces)
```

## Core Features Implemented

1. **Workflow Automation Builder**
   - Drag-and-drop action blocks
   - Trigger → Action logic
   - Manual run + run logs

2. **Integrations**
   - WhatsApp (mock webhook)
   - Email (SMTP/Gmail mock mode)
   - Webhook action for external apps
   - DB persistence for leads/workflows/runs

3. **AI Smart Replies**
   - OpenAI-powered responses
   - Context + tone support (professional/friendly/sales)
   - Graceful mock fallback when no API key

4. **Lead Dashboard**
   - Name/phone/email capture
   - Tags (`hot`, `cold`, `follow-up` etc.)
   - Activity tracking
   - CSV export

5. **Automation Templates**
   - Lead follow-up
   - Appointment booking
   - Instagram/WhatsApp auto-reply
   - Customer support bot

6. **Scheduling**
   - Delay actions in workflows
   - Time-based cron scheduling

7. **SaaS Controls / Monetization**
   - Free plan workflow limit
   - Pro plan at ₹499/month (upgrade endpoint)

8. **UX**
   - Clean dashboard + sidebar
   - Dark/light mode
   - Responsive layout
   - Notification bell
   - Basic EN/HI multi-language switch

## Setup Instructions

### 1) Install dependencies

```bash
npm install
npm install --workspace frontend
npm install --workspace backend
```

### 2) Configure environment variables

Backend:
```bash
cp backend/.env.example backend/.env
```

Frontend:
```bash
cp frontend/.env.local.example frontend/.env.local
```

### 3) Run locally

In separate terminals:
```bash
npm run dev:backend
npm run dev:frontend
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

## API Quick Start

1. Register user:
```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"email":"admin@autoflow.ai","password":"pass1234","name":"Admin"}'
```

2. Login and store token:
```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@autoflow.ai","password":"pass1234"}'
```

3. Use token in frontend localStorage as `token`.

## Environment Variables Guide

### Backend (`backend/.env`)
- `PORT`: backend port (default `4000`)
- `JWT_SECRET`: JWT signing key
- `CORS_ORIGIN`: allowed frontend origins
- `OPENAI_API_KEY`: OpenAI secret key (optional, mock if empty)
- `OPENAI_MODEL`: model name
- `FREE_WORKFLOW_LIMIT`: max workflows for free users

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`: backend API base URL

## Deployment Guide

### Frontend on Vercel
1. Import repo into Vercel.
2. Set root directory to `frontend`.
3. Add env var: `NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api`
4. Deploy.

### Backend hosting options
- Render / Railway / Fly.io / DigitalOcean App Platform

Steps:
1. Set service root to `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add required env vars from `.env.example`.

## Notes on Performance & Reliability
- Lightweight UI and API payloads for fast first load.
- Centralized API error handling in frontend helper and Express middleware.
- Scalable route/service split in backend for future queue workers and DB migration.
