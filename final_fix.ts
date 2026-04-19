import * as fs from 'fs';

const filePath = './constants.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// Simple parser for the TRANSLATIONS object
function extractTranslations(text: string): Record<string, Record<string, string>> {
  const translations: Record<string, Record<string, string>> = {};
  
  // Find the start of the TRANSLATIONS object
  const startMarker = 'export const TRANSLATIONS: Record<string, any> = {';
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return {};

  const lines = text.split('\n');
  let currentLang = '';
  let inObject = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('{')) console.log("Checking line:", line);
    
    // Check for language start
    const langMatch = line.match(/^([a-z]{2,3}):\s*\{/);
    if (langMatch) {
      currentLang = langMatch[1];
      translations[currentLang] = {};
      inObject = true;
      continue;
    }

    if (inObject && line === '},') {
      inObject = false;
      currentLang = '';
      continue;
    }

    if (inObject && currentLang) {
      // Very basic key-value extraction
      const kvMatch = line.match(/^\s*([a-zA-Z0-9_]+):\s*"([^"]*)"/);
      if (kvMatch) {
        translations[currentLang][kvMatch[1]] = kvMatch[2];
      }
    }
  }

  return translations;
}

const translations = extractTranslations(content);
const englishKeys = Object.keys(translations['en'] || {});

if (englishKeys.length === 0) {
  console.error("Could not find English translations");
  process.exit(1);
}

// Rebuild the TRANSLATIONS object string
let newTranslationsStr = 'export const TRANSLATIONS: Record<string, any> = {\n';

for (const lang of Object.keys(translations)) {
  newTranslationsStr += `  ${lang}: {\n`;
  
  // Use a Set to avoid duplicates and maintain some order
  const allKeys = new Set([...englishKeys, ...Object.keys(translations[lang])]);
  
  for (const key of allKeys) {
    const value = translations[lang][key] || translations['en'][key];
    // Escape double quotes in value
    const escapedValue = (value || '').replace(/"/g, '\\"');
    newTranslationsStr += `    ${key}: "${escapedValue}",\n`;
  }
  
  newTranslationsStr += `  },\n`;
}

newTranslationsStr += '};';

// Replace the old TRANSLATIONS object with the new one
const startMarkerReplacement = 'export const TRANSLATIONS: Record<string, any> = {';
const startIndex = content.indexOf(startMarkerReplacement);
const endIndex = content.lastIndexOf('};');

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  const newContent = content.substring(0, startIndex) + newTranslationsStr + content.substring(endIndex + 2);
  fs.writeFileSync(filePath, newContent);
  console.log("Successfully rebuilt TRANSLATIONS object.");
} else {
  console.error("Could not find TRANSLATIONS object boundaries.");
}
