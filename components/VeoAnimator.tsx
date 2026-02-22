
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const VeoAnimator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Animate the cosmic energies flowing from this celestial image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setBase64(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // MUST assume the key selection was successful after triggering openSelectKey()
    }
    return true;
  };

  const generateVideo = async () => {
    if (!base64) return;
    try {
      setIsGenerating(true);
      setStatusMessage('Checking permissions...');
      await checkApiKey();

      // Always create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const rawBase64 = base64.split(',')[1];

      setStatusMessage('Initiating Veo engine...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: rawBase64,
          mimeType: file?.type || 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatusMessage('Stellar rendering in progress... (can take 1-2 mins)');
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatusMessage('Downloading celestial visual...');
        // Append API key when fetching from the download link
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
      setIsGenerating(false);
    } catch (err: any) {
      console.error(err);
      // Handle "Requested entity was not found" by prompting for key again
      if (err.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        if (window.aistudio) await window.aistudio.openSelectKey();
      }
      setStatusMessage('Generation failed. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/80 rounded-2xl border border-yellow-700/30 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-yellow-500 mb-4 astrological-font">Cosmic Vision Animator</h3>
      <p className="text-sm text-slate-400 mb-6">Upload an image of your birth chart, a sacred yantra, or a deity to see it animated with celestial energy.</p>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Select Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-900/30 file:text-yellow-500 hover:file:bg-yellow-900/50"
          />
          {base64 && <img src={base64} alt="Preview" className="mt-2 rounded-lg border border-slate-700 h-32 object-cover w-full" />}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Animation Intention</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-yellow-600 min-h-[80px]"
            placeholder="Describe how the stars should move..."
          />
        </div>

        {!isGenerating ? (
          <button 
            disabled={!base64}
            onClick={generateVideo}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${!base64 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white hover:scale-[1.02]'}`}
          >
            Animate with Veo
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full animate-shimmer" style={{ width: '100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', backgroundSize: '200% 100%' }}></div>
            </div>
            <p className="text-indigo-400 animate-pulse font-medium">{statusMessage}</p>
          </div>
        )}

        {videoUrl && (
          <div className="mt-8">
            <h4 className="text-sm font-bold text-yellow-600 uppercase mb-2">Your Celestial Vision</h4>
            <video src={videoUrl} controls className="w-full rounded-xl border border-indigo-900/50 shadow-2xl" />
            <a 
              href={videoUrl} 
              download="celestial-vision.mp4"
              className="mt-2 block text-center text-xs text-indigo-400 hover:underline"
            >
              Download Video
            </a>
          </div>
        ) }
      </div>
      <div className="mt-6 p-3 bg-slate-950/50 rounded text-[10px] text-slate-500 italic">
        Requires Google AI Studio Billing account for Veo 3.1 access. 
        See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-500">billing documentation</a>.
      </div>
    </div>
  );
};

export default VeoAnimator;
