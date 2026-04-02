import { AutoViralResponse, Category } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface AutoModePayload {
  topic: string;
  category: Category;
  language: string;
  format: '9:16' | '16:9';
  voiceGender: 'male' | 'female';
  tone: 'normal' | 'energetic' | 'dramatic';
  speed: number;
}

export async function runAutoViral(payload: AutoModePayload): Promise<AutoViralResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auto-viral`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Auto Viral Mode failed');
  }

  return response.json();
}
