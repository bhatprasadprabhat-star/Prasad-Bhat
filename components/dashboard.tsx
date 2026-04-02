'use client';

import { useMemo, useState } from 'react';
import { Play, Sparkles, Download, CalendarDays } from 'lucide-react';
import { runAutoViral } from '@/lib/api';
import { AutoViralResponse, Category } from '@/lib/types';

const categories: Category[] = ['motivation', 'facts', 'business', 'astrology', 'horror', 'storytelling'];

export function Dashboard() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<Category>('facts');
  const [language, setLanguage] = useState('English');
  const [format, setFormat] = useState<'9:16' | '16:9'>('9:16');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  const [tone, setTone] = useState<'normal' | 'energetic' | 'dramatic'>('energetic');
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AutoViralResponse | null>(null);

  const progressText = useMemo(() => {
    if (!loading) return 'Idle';
    return 'Generating script, voice, visuals, optimization assets and thumbnail…';
  }, [loading]);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runAutoViral({ topic, category, language, format, voiceGender, tone, speed });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neon">AutoTube AI</h1>
          <p className="text-sm text-white/70">Topic → Script → Video → Download</p>
        </div>
        <span className="rounded-full border border-neon/50 px-3 py-1 text-xs">Creator OS</span>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1 space-y-4">
          <h2 className="font-semibold">Auto Viral Mode</h2>
          <input
            className="w-full rounded-md bg-black/30 p-2"
            placeholder="Enter topic or keyword"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <select className="w-full rounded-md bg-black/30 p-2" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select className="rounded-md bg-black/30 p-2" value={format} onChange={(e) => setFormat(e.target.value as '9:16' | '16:9')}>
              <option value="9:16">Shorts (9:16)</option>
              <option value="16:9">Long-form (16:9)</option>
            </select>
            <select className="rounded-md bg-black/30 p-2" value={voiceGender} onChange={(e) => setVoiceGender(e.target.value as 'male' | 'female')}>
              <option value="female">Female voice</option>
              <option value="male">Male voice</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className="rounded-md bg-black/30 p-2" value={tone} onChange={(e) => setTone(e.target.value as 'normal' | 'energetic' | 'dramatic')}>
              <option value="normal">Normal</option>
              <option value="energetic">Energetic</option>
              <option value="dramatic">Dramatic</option>
            </select>
            <input className="rounded-md bg-black/30 p-2" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />
          </div>
          <label className="text-xs text-white/70">Voice speed: {speed.toFixed(1)}x</label>
          <input type="range" min="0.8" max="1.4" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />

          <button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-neon to-accent p-2 text-black font-semibold disabled:opacity-50"
            disabled={loading || !topic.trim()}
            onClick={onGenerate}
          >
            <Play size={16} /> Generate Full Video
          </button>

          <p className="text-xs text-white/60">{progressText}</p>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>

        <div className="card lg:col-span-2 space-y-4">
          <h2 className="flex items-center gap-2 font-semibold"><Sparkles size={16} /> Generation Output</h2>
          {!result ? (
            <p className="text-white/60 text-sm">Run Auto Viral Mode to generate script, voiceover, video, titles, SEO and thumbnail concepts.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-neon">Script Hook</h3>
                <p>{result.script.hook}</p>
              </div>
              <div>
                <h3 className="font-medium text-neon">Main Content</h3>
                <ul className="list-disc pl-5">{result.script.main.map((line, i) => <li key={i}>{line}</li>)}</ul>
              </div>
              <div>
                <h3 className="font-medium text-neon">Viral Titles</h3>
                <ul className="list-disc pl-5">{result.optimization.titles.map((line, i) => <li key={i}>{line}</li>)}</ul>
              </div>
              <p><strong>SEO:</strong> {result.optimization.seoDescription}</p>
              <p><strong>Hashtags:</strong> {result.optimization.hashtags.join(' ')}</p>
              <p><strong>Viral Score:</strong> {result.optimization.viralScore}/100</p>
              <p><strong>Thumbnail idea:</strong> {result.thumbnail.concept} — {result.thumbnail.textOverlay}</p>
              <div className="flex flex-wrap gap-3">
                <a className="rounded-md border border-white/20 px-3 py-1 inline-flex items-center gap-1" href={result.voiceoverUrl}><Download size={14}/> Voiceover</a>
                <a className="rounded-md border border-white/20 px-3 py-1 inline-flex items-center gap-1" href={result.videoUrl}><Download size={14}/> Rendered Video</a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 card">
        <h2 className="mb-2 flex items-center gap-2 font-semibold"><CalendarDays size={16} /> Content Calendar + Monetization</h2>
        <p className="text-sm text-white/70">Free: limited videos/month • Pro: ₹499/month • Premium: ₹999/month with bulk generation + priority processing.</p>
      </section>
    </main>
  );
}
