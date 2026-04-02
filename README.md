# AutoTube AI

AutoTube AI is a full-stack AI-powered YouTube automation app for Shorts and long-form content. It turns a topic into a complete video package (script + voiceover + optimization assets + thumbnail concept) with a single click.

## Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** FastAPI (Python)
- **AI Integrations:** OpenAI (script), ElevenLabs (voice placeholder), FFmpeg/Video API-ready pipeline hooks
- **Data Layer:** Supabase/Firebase-ready via environment variables and service adapter extension points

## Product Features Implemented

1. Viral Script Generator
   - Topic/category input
   - Hook + main story beats + pattern interrupts + CTA output
   - Categories: motivation, facts, business, astrology, horror, storytelling
2. AI Voiceover Generator
   - Voice gender, speed, tone controls
   - ElevenLabs-ready backend integration pattern
3. Video Generator Pipeline
   - End-to-end orchestration endpoint (`/api/v1/auto-viral`)
   - Export profile support: `9:16` and `16:9`
4. Viral Optimization Engine
   - 5 clickable titles
   - SEO description
   - Hashtags
   - Viral score estimate
5. Thumbnail Generator
   - Clickbait concept and text overlay suggestion
6. Export System
   - Returned voiceover/video asset URLs for download actions
7. Content Calendar / Monetization
   - Dashboard includes subscription tiers and calendar workflow surface
8. Extra
   - Multi-language input
   - Auto Viral Mode (one click full generation)

---

## Folder Structure

```text
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── dashboard.tsx
├── lib/
│   ├── api.ts
│   └── types.ts
├── backend/
│   ├── main.py
│   └── requirements.txt
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── postcss.config.mjs
```

## Local Setup

### 1) Frontend

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 2) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

### 3) Environment Variables

Copy `.env.example` to `.env.local` (frontend) and/or `.env` (backend) and set values:

- `NEXT_PUBLIC_API_BASE_URL`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## API Integration Guide

### OpenAI (Script + Titles)

The backend calls OpenAI via `https://api.openai.com/v1/responses` if `OPENAI_API_KEY` is set. Without a key, it falls back to deterministic mock generation for local testing.

### ElevenLabs (Voice)

`ELEVENLABS_API_KEY` enables swapping placeholder voice URL with live generated TTS URL. A production adapter should:

1. Send script text + selected voice/tone/speed to ElevenLabs TTS endpoint.
2. Save audio to object storage (S3/Supabase Storage).
3. Return the signed URL in `voiceoverUrl`.

### Video API / FFmpeg

Replace `video_url` placeholder in `backend/main.py` with:

- Scene extraction from script blocks.
- Stock footage lookup or AI visual generation (Runway/Pika).
- Caption rendering + subtitle animation.
- Background music layering.
- Final mux/export via FFmpeg.

### Supabase / Firebase

Current code is stateless and ready for persistence extension:

- Save projects: input, script, assets, status, timestamps.
- Add auth/session.
- Enforce free/pro/premium monthly quotas.

---

## Deployment

### Frontend (Vercel)

1. Import repo in Vercel.
2. Set `NEXT_PUBLIC_API_BASE_URL` to deployed backend URL.
3. Deploy.

### Backend (Render/Fly.io/Railway)

1. Deploy `backend/` as Python web service.
2. Start command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Add environment variables for AI/API providers.

---

## Reliability / Performance Design

- Retry wrapper for upstream AI API requests.
- Graceful fallback output when APIs are missing/unavailable.
- Async FastAPI endpoints for non-blocking orchestration.
- Clear error propagation to UI.

---

## Pricing Tiers in Product

- **Free:** limited videos/month
- **Pro:** ₹499/month (more exports, HD, faster generation)
- **Premium:** ₹999/month (bulk generation + priority processing)

---

## Next Improvements for 1M+ View Workflow

- Trend ingestion (YouTube trends, Google Trends, social listening)
- Retention-aware script scoring model
- A/B title + thumbnail testing
- Auto scheduling with best-post-time prediction
- Batch generation queue + webhook notifications
