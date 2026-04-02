import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B14',
        panel: '#121526',
        neon: '#4EF1FF',
        accent: '#B06DFF'
      }
    }
  },
  plugins: []
};

export default config;
