import fs from 'node:fs';
import vm from 'node:vm';

const required = ['AGENTS.md', 'index.html', 'docs.css', 'app.js', 'components.js', 'src/foundry.css', 'src/icons.svg', 'src/icon-sprite.js', 'src/icon-registry.js', 'tokens.json', 'assets/cards/product-card.png', 'assets/cards/article-card.png', 'assets/cards/offer-card.png', 'assets/media/demo-audio.mp3', 'assets/media/demo-video.mp4', 'assets/media/demo-video.webm', 'assets/media/demo-video-poster.png', 'assets/media/demo-video.vtt'];
const missing = required.filter((file) => !fs.existsSync(new URL(`../${file}`, import.meta.url)));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(', ')}`);
  process.exit(1);
}

const components = fs.readFileSync(new URL('../components.js', import.meta.url), 'utf8');
const overviewApp = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const overviewCss = fs.readFileSync(new URL('../docs.css', import.meta.url), 'utf8');
const overviewRequirements = ['docs-overview-route', 'data-catalog-search', 'data-catalog-filter', 'data-catalog-count', 'data-pattern-filter'];
const missingOverviewRequirements = overviewRequirements.filter((marker) => !overviewApp.includes(marker));
if (missingOverviewRequirements.length || !overviewCss.includes('body.docs-overview-route .docs-sidebar')) {
  console.error(`Missing overview or catalog UX contracts: ${missingOverviewRequirements.join(', ') || 'overview layout CSS'}`);
  process.exit(1);
}
const ids = [...components.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);
if (ids.length < 35 || new Set(ids).size !== ids.length) {
  console.error(`Expected at least 35 unique documented components; found ${ids.length}.`);
  process.exit(1);
}

const requiredCatalog = {
  Foundation: ['Accent Colors', 'Colors & Tokens', 'Typography', 'Grid & Breakpoints', 'Component States'],
  Components: ['Buttons', 'Form Elements', 'Labels & Badges', 'Alerts', 'Tables', 'Tab & Subnav', 'Cards', 'Card Variants', 'Accordion', 'Nav', 'Icons', 'Lists', 'Progress', 'Audio', 'Video', 'Heading Styles', 'Sections & Tiles', 'Overlay & Marker', 'Dotnav & Slidenav', 'Text Utilities', 'Utility Classes'],
  Patterns: ['Masthead', 'Breadcrumb', 'Inputfield Wrappers', 'Module Guidelines', 'Module Workspace', 'Modal', 'Offcanvas', 'Dropdown & Navbar DD', 'Lightbox', 'Notifications', 'Pagination', 'Description List', 'Search', 'Comment', 'Panel & Scrollable']
};
const entries = [...components.matchAll(/group:\s*'([^']+)',\s*id:\s*'[^']+',\s*name:\s*'([^']+)'/g)].map((match) => `${match[1]}:${match[2]}`);
const missingCatalog = Object.entries(requiredCatalog).flatMap(([group, names]) => names.map((name) => `${group}:${name}`)).filter((entry) => !entries.includes(entry));
if (missingCatalog.length) {
  console.error(`Missing requested catalog entries: ${missingCatalog.join(', ')}`);
  process.exit(1);
}

const componentContext = vm.createContext({ window: { FOUNDRY_ICON_REGISTRY: [] } });
vm.runInContext(components, componentContext);
const renderedComponents = componentContext.window.FOUNDRY_COMPONENTS;
const renderedCopy = renderedComponents.map((item) => `${item.description}\n${item.preview}`).join('\n');
const prohibitedTheme = renderedCopy.match(/\b(?:bank(?:ing)?|loan(?:s)?|payment(?:s)?|interest|income|AUD|balance(?:s)?|financial|account(?:s)?|rate(?:s)?|fee(?:s)?|transfer(?:s|red)?|statement(?:s)?)\b/i);
if (prohibitedTheme) {
  console.error(`Found a prohibited banking-theme marker in rendered examples: ${prohibitedTheme[0]}`);
  process.exit(1);
}

const requiredDemoSections = { checkbox: 4, radio: 4, switch: 3, 'pagination-control': 5, 'pattern-pagination': 5 };
const incompleteExamples = Object.entries(requiredDemoSections).filter(([id, minimum]) => {
  const item = renderedComponents.find((component) => component.id === id);
  return !item || (item.preview.match(/<section class="fd-demo-section/g) || []).length < minimum;
});
if (incompleteExamples.length) {
  console.error(`Required component variants are not separated into enough demo sections: ${incompleteExamples.map(([id]) => id).join(', ')}`);
  process.exit(1);
}
const expandedCatalogPages = `accent-colors tokens grid-breakpoints component-states field header progress sections-tiles overlay-marker text-utilities utility-classes link phone-input select textarea file-upload validation chip tag spinner skeleton popover dialog simple-card surface-banner divider breadcrumbs stepper footer masthead pattern-breadcrumb inputfield-wrappers module-guidelines module-workspace modal offcanvas dropdown-navbar-dd lightbox notifications comment panel-scrollable`.split(' ');
const shallowCatalogPages = expandedCatalogPages.filter((id) => {
  const item = renderedComponents.find((component) => component.id === id);
  return !item || (item.examples?.length || 0) < 4;
});
if (shallowCatalogPages.length) {
  console.error(`Expanded catalog pages must render at least four independent examples: ${shallowCatalogPages.join(', ')}`);
  process.exit(1);
}
const checkboxDocumentation = renderedComponents.find((component) => component.id === 'checkbox');
if (checkboxDocumentation.examples?.length !== 4 || checkboxDocumentation.examples.some((example) => !example.title || !example.preview)) {
  console.error('Checkbox variants must render as four independent, named documentation examples.');
  process.exit(1);
}
const tableDocumentation = renderedComponents.find((component) => component.id === 'table');
if (tableDocumentation?.examples?.length !== 8) {
  console.error(`Tables must render as eight independent, named documentation examples; found ${tableDocumentation?.examples?.length || 0}.`);
  process.exit(1);
}
const tabsDocumentation = renderedComponents.find((component) => component.id === 'tabs');
if (tabsDocumentation?.examples?.length !== 6) {
  console.error(`Tabs must render as six independent, named documentation examples; found ${tabsDocumentation?.examples?.length || 0}.`);
  process.exit(1);
}
const listsDocumentation = renderedComponents.find((component) => component.id === 'lists');
if (listsDocumentation?.examples?.length !== 9) {
  console.error(`Lists must render as nine independent, named documentation examples; found ${listsDocumentation?.examples?.length || 0}.`);
  process.exit(1);
}
const videoDocumentation = renderedComponents.find((component) => component.id === 'video');
if (!videoDocumentation?.preview.includes('type="video/mp4"') || !videoDocumentation.preview.includes('type="video/webm"') || !videoDocumentation.preview.includes('kind="captions"')) {
  console.error('Video documentation must include local MP4 and WebM sources plus a captions track.');
  process.exit(1);
}
const headingDocumentation = renderedComponents.find((component) => component.id === 'heading-styles');
if (headingDocumentation?.examples?.length !== 8) {
  console.error(`Heading styles must render as eight independent, named documentation examples; found ${headingDocumentation?.examples?.length || 0}.`);
  process.exit(1);
}
const carouselDocumentation = renderedComponents.find((component) => component.id === 'dotnav-slidenav');
if (carouselDocumentation?.examples?.length !== 4 || !carouselDocumentation.preview.includes('data-carousel')) {
  console.error('Dotnav and slidenav must render as four independent examples with working carousel hooks.');
  process.exit(1);
}
const iconButtonDocumentation = renderedComponents.find((component) => component.id === 'icon-button');
if (iconButtonDocumentation?.examples?.length !== 10 || !iconButtonDocumentation.preview.includes('data-icon-toggle') || !iconButtonDocumentation.preview.includes('data-icon-toolbar')) {
  console.error('Icon buttons must render as ten independent examples with working toggle and toolbar hooks.');
  process.exit(1);
}
const toggleGroupDocumentation = renderedComponents.find((component) => component.id === 'toggle-group');
if (toggleGroupDocumentation?.examples?.length !== 9 || !toggleGroupDocumentation.preview.includes('data-toggle-group') || !toggleGroupDocumentation.preview.includes('data-toggle-multiple')) {
  console.error('Toggle groups must render as nine independent examples with single- and multiple-selection hooks.');
  process.exit(1);
}
const inputDocumentation = renderedComponents.find((component) => component.id === 'input');
if (inputDocumentation?.examples?.length !== 10 || !inputDocumentation.preview.includes('data-input-clear') || !inputDocumentation.preview.includes('data-password-toggle')) {
  console.error('Inputs must render as ten independent examples with clear and password action hooks.');
  process.exit(1);
}
const dateInputDocumentation = renderedComponents.find((component) => component.id === 'date-input');
if (dateInputDocumentation?.examples?.length !== 10 || !dateInputDocumentation.preview.includes('data-date-range-demo') || !dateInputDocumentation.preview.includes('data-date-clear') || dateInputDocumentation.preview.includes('data-date-trigger')) {
  console.error('Date inputs must render as ten independent examples with range and clear mechanics and no duplicate custom picker trigger.');
  process.exit(1);
}
const detailsDocumentation = renderedComponents.find((component) => component.id === 'details');
if (detailsDocumentation?.examples?.length !== 8 || !detailsDocumentation.preview.includes('data-accordion-single') || (detailsDocumentation.preview.match(/<details/g) || []).length < 20) {
  console.error('Details must render as eight independent, substantial examples with working single-open behavior.');
  process.exit(1);
}
const typographyDocumentation = renderedComponents.find((component) => component.id === 'typography');
if (typographyDocumentation?.examples?.length !== 10 || !typographyDocumentation.preview.includes('fd-typeface-specimen') || !typographyDocumentation.preview.includes('fd-editorial-specimen')) {
  console.error('Typography must render as ten independent examples including typeface and responsive editorial specimens.');
  process.exit(1);
}

function topLevelPreviewSections(markup) {
  const sections = [];
  const tags = /<\/?section\b[^>]*>/g;
  let depth = 0;
  let start = -1;
  let match;
  while ((match = tags.exec(markup))) {
    const closing = match[0].startsWith('</');
    if (!closing) {
      if (depth === 0) start = match.index;
      depth += 1;
    } else if (depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        sections.push(markup.slice(start, tags.lastIndex));
        start = -1;
      }
    }
  }
  return sections;
}

const unsplitComponentExamples = renderedComponents.filter((item) => {
  const sectionCount = topLevelPreviewSections(item.preview).length;
  return sectionCount > 1 && item.examples?.length !== sectionCount;
});
if (unsplitComponentExamples.length) {
  console.error(`Components with multiple preview sections must expose matching independent examples: ${unsplitComponentExamples.map((item) => item.id).join(', ')}.`);
  process.exit(1);
}
const incompleteNamedExamples = renderedComponents.filter((item) => item.examples?.some((example) => !example.slug || !example.title || !example.description || !example.preview));
if (incompleteNamedExamples.length) {
  console.error(`Every independent example needs a slug, title, description, and preview: ${incompleteNamedExamples.map((item) => item.id).join(', ')}.`);
  process.exit(1);
}

const icons = fs.readFileSync(new URL('../src/icons.svg', import.meta.url), 'utf8');
const iconIds = [...icons.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);
if (iconIds.length < 900 || new Set(iconIds).size !== iconIds.length) {
  console.error(`Expected at least 900 unique icons; found ${iconIds.length}.`);
  process.exit(1);
}
const registryText = fs.readFileSync(new URL('../src/icon-registry.js', import.meta.url), 'utf8');
const registryMatch = registryText.match(/=\s*(\[.*\]);/s);
const registryIds = registryMatch ? JSON.parse(registryMatch[1]) : [];
const iconSet = new Set(iconIds);
if (registryIds.length !== iconIds.length || registryIds.some((id) => !iconSet.has(id))) {
  console.error(`Icon registry is out of sync with the SVG sprite: ${registryIds.length} registry entries for ${iconIds.length} symbols.`);
  process.exit(1);
}
const inlineSpriteText = fs.readFileSync(new URL('../src/icon-sprite.js', import.meta.url), 'utf8');
const inlinePrefix = 'window.FOUNDRY_ICON_SPRITE = ';
const inlineEnd = inlineSpriteText.indexOf(';\ndocument.body.insertAdjacentHTML');
const inlineMarkup = inlineEnd > -1 ? JSON.parse(inlineSpriteText.slice(inlinePrefix.length, inlineEnd)) : '';
const inlineIds = [...inlineMarkup.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);
if (inlineIds.length !== iconIds.length || inlineIds.some((id) => !iconSet.has(id))) {
  console.error(`Inline icon sprite is out of sync: ${inlineIds.length} inline symbols for ${iconIds.length} source symbols.`);
  process.exit(1);
}
const fileProtocolPages = ['index.html', 'app.js', 'components.js'].map((file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')).join('\n');
if (fileProtocolPages.includes('src/icons.svg#')) {
  console.error('Documentation still contains external SVG fragment references that fail under file://.');
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
const docsCss = fs.readFileSync(new URL('../docs.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
if (!docsCss.includes('.example__toolbar [data-show-code]') || !docsCss.includes('.example.fd-theme-dark') || !app.includes("root.classList.toggle('fd-theme-dark')")) {
  console.error('Example controls must keep a stable code-button width and apply dark mode to the complete example container.');
  process.exit(1);
}
if (!docsCss.includes('.component-example + .component-example') || !docsCss.includes('.component-example + #usage') || !css.includes('.fd-card__facts') || !css.includes('.fd-card__facts dd')) {
  console.error('Documentation section rhythm and structured card facts must remain explicitly styled.');
  process.exit(1);
}
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
if (!docsCss.includes('html.theme-switching *') || !app.includes("themeRoot.classList.add('theme-switching')") || !app.includes("themeRoot.classList.toggle('fd-theme-dark')") || !index.includes("localStorage.getItem('foundry-theme')") || index.indexOf("localStorage.getItem('foundry-theme')") > index.indexOf('src/foundry.css')) {
  console.error('Global theme switching must be atomic and restore the saved theme before styles load.');
  process.exit(1);
}
const accentTokens = ['--fd-accent:', '--fd-accent-hover:', '--fd-accent-contrast:', '--fd-accent-soft:', '--fd-accent-soft-contrast:'];
const missingAccentTokens = accentTokens.filter((token) => !css.includes(token));
if (missingAccentTokens.length || !components.includes('data-accent-picker')) {
  console.error(`Custom accent support is incomplete: ${missingAccentTokens.join(', ') || 'missing interactive picker'}.`);
  process.exit(1);
}

const darkTokens = ['--fd-color-info-text:', '--fd-color-success-text:', '--fd-color-warning-text:', '--fd-color-danger-text:'];
const darkTheme = css.slice(css.indexOf('.fd-theme-dark'), css.indexOf('.fd-icon'));
const missingDarkTokens = darkTokens.filter((token) => !darkTheme.includes(token));
if (missingDarkTokens.length) {
  console.error(`Dark mode is missing semantic tokens: ${missingDarkTokens.join(', ')}.`);
  process.exit(1);
}
const sharedControlTokens = ['--fd-color-focus:', '--fd-control-border:', '--fd-control-border-hover:', '--fd-control-border-focus:', '--fd-control-focus-ring:'];
const missingSharedControlTokens = sharedControlTokens.filter((token) => !css.includes(token));
if (missingSharedControlTokens.length || !css.includes('.fd-input-group:focus-within') || !css.includes('.fd-file-upload:focus-within')) {
  console.error(`Unified control focus styling is incomplete: ${missingSharedControlTokens.join(', ') || 'missing grouped or file-input focus styling'}.`);
  process.exit(1);
}

const independentExampleCount = renderedComponents.reduce((total, item) => total + (item.examples?.length || 1), 0);
console.log(`Validated ${ids.length} pages, ${independentExampleCount} independent examples, ${iconIds.length} icons, the fd- namespace, regional neutrality, custom accents, and semantic dark tokens.`);
