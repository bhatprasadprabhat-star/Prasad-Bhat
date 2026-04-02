export type Category =
  | 'motivation'
  | 'facts'
  | 'business'
  | 'astrology'
  | 'horror'
  | 'storytelling';

export interface AutoViralResponse {
  script: {
    hook: string;
    main: string[];
    interrupts: string[];
    cta: string;
  };
  voiceoverUrl: string;
  videoUrl: string;
  optimization: {
    titles: string[];
    seoDescription: string;
    hashtags: string[];
    viralScore: number;
  };
  thumbnail: {
    concept: string;
    textOverlay: string;
  };
}
