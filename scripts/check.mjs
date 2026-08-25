import fs from 'node:fs';

const required = ['index.html', 'docs.css', 'app.js', 'components.js', 'src/foundry.css', 'src/icons.svg', 'tokens.json'];
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

const requiredCatalog = {
  Foundation: ['Accent Colors', 'Colors & Tokens', 'Typography', 'Grid & Breakpoints', 'Component States'],
  Components: ['Buttons', 'Form Elements', 'Labels & Badges', 'Alerts', 'Tables', 'Tab & Subnav', 'Cards', 'Card Variants', 'Accordion', 'Nav', 'Icons', 'Lists', 'Progress', 'Heading Styles', 'Sections & Tiles', 'Overlay & Marker', 'Dotnav & Slidenav', 'Text Utilities', 'Utility Classes'],
  Patterns: ['Masthead', 'Breadcrumb', 'Inputfield Wrappers', 'Module Guidelines', 'Module Workspace', 'Modal', 'Offcanvas', 'Dropdown & Navbar DD', 'Lightbox', 'Notifications', 'Pagination', 'Description List', 'Search', 'Comment', 'Panel & Scrollable']
};
const entries = [...components.matchAll(/group:\s*'([^']+)',\s*id:\s*'[^']+',\s*name:\s*'([^']+)'/g)].map((match) => `${match[1]}:${match[2]}`);
const missingCatalog = Object.entries(requiredCatalog).flatMap(([group, names]) => names.map((name) => `${group}:${name}`)).filter((entry) => !entries.includes(entry));
if (missingCatalog.length) {
  console.error(`Missing requested catalog entries: ${missingCatalog.join(', ')}`);
  process.exit(1);
}

const icons = fs.readFileSync(new URL('../src/icons.svg', import.meta.url), 'utf8');
const iconIds = [...icons.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);
if (iconIds.length < 24 || new Set(iconIds).size !== iconIds.length) {
  console.error(`Expected at least 24 unique icons; found ${iconIds.length}.`);
  process.exit(1);
}

const portableFiles = ['README.md', 'app.js', 'components.js', 'docs.css', 'src/foundry.css', 'tokens.json'];
const portableText = portableFiles.map((file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')).join('\n');
const legacyNamespace = portableText.match(/(?:--|\.|\b)rb-/i);
if (legacyNamespace) {
  console.error(`Found the retired namespace: ${legacyNamespace[0]}`);
  process.exit(1);
}
const regionalMarkers = portableText.match(/\b(?:HUF|Hungary|Hungarian|Magyar|Budapest|Amalia|hu_HU)\b|\+36|\.hu\b/i);
if (regionalMarkers) {
  console.error(`Found a prohibited regional marker: ${regionalMarkers[0]}`);
  process.exit(1);
}

const css = fs.readFileSync(new URL('../src/foundry.css', import.meta.url), 'utf8');
const accentTokens = ['--fd-accent:', '--fd-accent-hover:', '--fd-accent-contrast:', '--fd-accent-soft:'];
const missingAccentTokens = accentTokens.filter((token) => !css.includes(token));
if (missingAccentTokens.length || !components.includes('data-accent-picker')) {
  console.error(`Custom accent support is incomplete: ${missingAccentTokens.join(', ') || 'missing interactive picker'}.`);
  process.exit(1);
}

console.log(`Validated ${ids.length} isolated pages, ${iconIds.length} icons, the fd- namespace, regional neutrality, and custom accent support.`);
