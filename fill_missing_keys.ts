import fs from 'fs';

const content = fs.readFileSync('constants.tsx', 'utf8');
const lines = content.split('\n');

const translationsStartLine = lines.findIndex(l => l.includes('export const TRANSLATIONS: Record<string, any> = {'));
if (translationsStartLine === -1) {
  console.error('Could not find TRANSLATIONS start');
  process.exit(1);
}

const header = lines.slice(0, translationsStartLine + 1).join('\n');

const languages = ['en', 'kn', 'mr', 'hi', 'sa', 'te', 'ta', 'ml', 'tcy', 'kok', 'gu', 'bn'];

const enStart = lines.findIndex(l => l.match(/^\s+en:\s*\{/));
const enEnd = lines.findIndex((l, i) => i > enStart && l.match(/^\s+\},/));
const enBlockLines = lines.slice(enStart + 1, enEnd);
const enKv: Record<string, string> = {};
enBlockLines.forEach(line => {
  const match = line.match(/^\s+([a-z0-9_]+):\s*(.*)$/);
  if (match) {
    let value = match[2].trim();
    if (value.endsWith(',')) value = value.slice(0, -1);
    enKv[match[1]] = value;
  }
});

let newContent = header + '\n';

languages.forEach(lang => {
  const startIdx = lines.findIndex(l => l.match(new RegExp(`^\\s+${lang}:\\s*\\{`)));
  if (startIdx === -1) return;
  const endIdx = lines.findIndex((l, i) => i > startIdx && l.match(/^\s+\},/));
  
  const langBlockLines = lines.slice(startIdx + 1, endIdx);
  const langKv: Record<string, string> = {};
  langBlockLines.forEach(line => {
    const match = line.match(/^\s+([a-z0-9_]+):\s*(.*)$/);
    if (match) {
      let value = match[2].trim();
      if (value.endsWith(',')) value = value.slice(0, -1);
      langKv[match[1]] = value;
    }
  });

  newContent += `  ${lang}: {\n`;
  const keys = Object.keys(enKv);
  keys.forEach((key, idx) => {
    const comma = idx === keys.length - 1 ? '' : ',';
    if (langKv[key]) {
      newContent += `    ${key}: ${langKv[key]}${comma}\n`;
    } else {
      newContent += `    ${key}: ${enKv[key]}${comma}\n`;
    }
  });
  newContent += `  },\n`;
});

// Remove trailing comma from last language block if needed, but the loop adds it to all
// Actually the structure is { en: {}, kn: {}, ... }
// So we can just end with };
newContent = newContent.trimEnd();
if (newContent.endsWith(',')) {
    newContent = newContent.slice(0, -1);
}
newContent += '\n};\n';

fs.writeFileSync('constants.tsx', newContent);
console.log('constants.tsx has been rebuilt with all keys present in all languages.');
