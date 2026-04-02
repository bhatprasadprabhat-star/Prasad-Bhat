import os
import random
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title='AutoTube AI API', version='1.0.0')

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', '')


class AutoViralRequest(BaseModel):
  topic: str = Field(min_length=2)
  category: Literal['motivation', 'facts', 'business', 'astrology', 'horror', 'storytelling']
  language: str = 'English'
  format: Literal['9:16', '16:9'] = '9:16'
  voiceGender: Literal['male', 'female'] = 'female'
  tone: Literal['normal', 'energetic', 'dramatic'] = 'energetic'
  speed: float = 1.0


async def retry_request(url: str, payload: dict, headers: dict, retries: int = 2) -> dict:
  last_error = None
  for _ in range(retries + 1):
    try:
      async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as exc:
      last_error = exc
  raise HTTPException(status_code=502, detail=f'Upstream provider failed: {last_error}')


async def generate_script(req: AutoViralRequest) -> dict:
  if not OPENAI_API_KEY:
    return {
      'hook': f"What if everything you know about {req.topic} is wrong?",
      'main': [
        f"Start with a bold claim about {req.topic} in {req.language}.",
        'Introduce a quick story with surprising payoff.',
        'Deliver 3 actionable points with punchy pacing.'
      ],
      'interrupts': ['Wait for it…', 'But here is the twist.', 'Most people miss this part.'],
      'cta': 'Comment your take and subscribe for daily viral drops.'
    }

  prompt = (
    f"Create YouTube script in {req.language} for {req.category} on topic: {req.topic}. "
    'Include hook, main bullets, pattern interrupts, CTA.'
  )
  data = await retry_request(
    'https://api.openai.com/v1/responses',
    {
      'model': 'gpt-4.1-mini',
      'input': prompt
    },
    {'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'}
  )
  text = data.get('output_text', '')
  return {
    'hook': text.split('\n')[0] if text else f'You are 30 seconds away from mastering {req.topic}',
    'main': [line for line in text.split('\n')[1:4] if line] or ['Point 1', 'Point 2', 'Point 3'],
    'interrupts': ['Stop scrolling.', 'This changes everything.', 'Don\'t skip this.'],
    'cta': 'Subscribe for more growth hacks.'
  }


def generate_optimization(topic: str) -> dict:
  titles = [
    f'I Tried {topic} for 7 Days (Shocking Results)',
    f'{topic} Secrets Nobody Tells You',
    f'How {topic} Can Make You Better Instantly',
    f'The Dark Truth About {topic}',
    f'{topic}: Beginner to Pro in 5 Minutes'
  ]
  return {
    'titles': titles,
    'seoDescription': f'Discover proven strategies, storytelling and actionable insights around {topic} with this AI-generated video optimized for retention.',
    'hashtags': ['#youtube', '#viral', '#shorts', f"#{topic.replace(' ', '')}"],
    'viralScore': random.randint(78, 96)
  }


def generate_thumbnail(topic: str) -> dict:
  return {
    'concept': f'High contrast close-up face + glowing {topic} keyword + directional arrows',
    'textOverlay': f'{topic.upper()} EXPOSED!'
  }


@app.get('/health')
async def health() -> dict:
  return {'status': 'ok'}


@app.post('/api/v1/auto-viral')
async def auto_viral(req: AutoViralRequest) -> dict:
  script = await generate_script(req)
  optimization = generate_optimization(req.topic)
  thumbnail = generate_thumbnail(req.topic)

  voice_url = 'https://example.com/mock-voiceover.mp3'
  if ELEVENLABS_API_KEY:
    voice_url = 'https://api.elevenlabs.io/generated/voiceover.mp3'

  video_url = f'https://example.com/generated-video-{req.format.replace(":", "x")}.mp4'

  return {
    'script': script,
    'voiceoverUrl': voice_url,
    'videoUrl': video_url,
    'optimization': optimization,
    'thumbnail': thumbnail
  }
