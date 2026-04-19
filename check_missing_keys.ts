import fs from 'fs';

const content = fs.readFileSync('constants.tsx', 'utf8');
const lines = content.split('\n');

const blocks: Record<string, Set<string>> = {};
let currentBlock: string | null = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const blockMatch = line.match(/^\s+([a-z]{2,3}):\s*\{/);
  if (blockMatch) {
    currentBlock = blockMatch[1];
    blocks[currentBlock] = new Set();
    continue;
  }
  
  if (line.match(/^\s+\},?\s*(};)?\s*$/)) {
    currentBlock = null;
    continue;
  }
  
  if (currentBlock) {
    const keyMatch = line.match(/^\s+([a-z0-9_]+):/);
    if (keyMatch) {
      blocks[currentBlock].add(keyMatch[1]);
    }
  }
}

const enKeys = Array.from(blocks['en']);
const otherLanguages = Object.keys(blocks).filter(l => l !== 'en');

console.log(`Total keys in 'en': ${enKeys.length}`);

otherLanguages.forEach(lang => {
  const langKeys = blocks[lang];
  const missing = enKeys.filter(k => !langKeys.has(k));
  if (missing.length > 0) {
    console.log(`\nLanguage '${lang}' is missing ${missing.length} keys:`);
    console.log(missing.join(', '));
  } else {
    console.log(`\nLanguage '${lang}' has all keys.`);
  }
});
