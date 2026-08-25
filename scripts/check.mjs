import fs from 'node:fs';

const required = ['index.html', 'docs.css', 'app.js', 'components.js', 'src/raif.css', 'src/icons.svg', 'tokens.json'];
const missing = required.filter((file) => !fs.existsSync(new URL(`../${file}`, import.meta.url)));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(', ')}`);
  process.exit(1);
}

const components = fs.readFileSync(new URL('../components.js', import.meta.url), 'utf8');
const ids = [...components.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);
if (ids.length < 35 || new Set(ids).size !== ids.length) {
  console.error(`Expected at least 35 unique documented components; found ${ids.length}.`);
  process.exit(1);
}

const icons = fs.readFileSync(new URL('../src/icons.svg', import.meta.url), 'utf8');
const iconIds = [...icons.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);
if (iconIds.length < 24 || new Set(iconIds).size !== iconIds.length) {
  console.error(`Expected at least 24 unique icons; found ${iconIds.length}.`);
  process.exit(1);
}

console.log(`Validated ${ids.length} component pages and ${iconIds.length} icons.`);
