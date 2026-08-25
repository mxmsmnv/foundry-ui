const components = window.FOUNDRY_COMPONENTS;
const main = document.querySelector('#main');
const nav = document.querySelector('#component-nav');
const search = document.querySelector('#component-search');
const groups = ['Foundation', 'Components', 'Patterns'];
const catalogOrder = [
  'Accent Colors', 'Colors & Tokens', 'Typography', 'Grid & Breakpoints', 'Component States',
  'Buttons', 'Form Elements', 'Labels & Badges', 'Alerts', 'Tables', 'Tab & Subnav', 'Cards', 'Card Variants', 'Accordion', 'Nav', 'Icons', 'Lists', 'Progress', 'Heading Styles', 'Sections & Tiles', 'Overlay & Marker', 'Dotnav & Slidenav', 'Text Utilities', 'Utility Classes',
  'Masthead', 'Breadcrumb', 'Inputfield Wrappers', 'Module Guidelines', 'Module Workspace', 'Modal', 'Offcanvas', 'Dropdown & Navbar DD', 'Lightbox', 'Notifications', 'Pagination', 'Description List', 'Search', 'Comment', 'Panel & Scrollable'
];
const rank = (item) => { const index = catalogOrder.indexOf(item.name); return index === -1 ? 1000 : index; };
let toastTimer;

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const prettify = (value) => value.replace(/></g, '>\n<').trim();

function renderNavigation(query = '') {
  const term = query.trim().toLowerCase();
  const html = groups.map((group) => {
    const matches = components.filter((item) => item.group === group && `${item.name} ${item.description}`.toLowerCase().includes(term)).sort((a, b) => rank(a) - rank(b));
    if (!matches.length) return '';
    return `<section class="nav-group"><h2>${group}</h2>${matches.map((item) => `<a data-component-link="${item.id}" href="#/components/${item.id}">${item.name}</a>`).join('')}</section>`;
  }).join('');
  nav.innerHTML = html || '<p class="empty-state">No components found.</p>';
  updateActiveNavigation();
}

function updateActiveNavigation() {
  const id = location.hash.split('/')[2];
  document.querySelectorAll('[data-component-link]').forEach((link) => link.classList.toggle('active', link.dataset.componentLink === id));
}

function showToast(message = 'Code copied') {
  const toast = document.querySelector('.copy-toast');
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showToast();
}

function pageHeader(kicker, title, lead) {
  return `<header class="docs-page__heading"><div><p class="docs-kicker">${kicker}</p><h1>${title}</h1><p class="docs-page__lead">${lead}</p></div></header>`;
}

function renderHome() {
  main.innerHTML = `<article class="docs-page">${pageHeader('Foundry UI', 'A portable interface foundation', 'An independent, copy-ready design system for building clear product experiences across frameworks and platforms.')}
    <div class="rb-alert rb-alert--info">${icon('info')}<div class="rb-alert__content"><strong>Framework-independent by design</strong><span>Foundry UI ships semantic HTML, CSS custom properties, isolated patterns, and a dependency-free SVG sprite.</span></div></div>
    <section class="docs-section"><h2>Start building</h2><p>Browse the complete catalog, inspect live states, and copy production-oriented HTML from every component page.</p><div class="component-gallery">${components.slice(0, 12).map(tile).join('')}</div></section>
    <section class="docs-section"><h2>Install the portable layer</h2><div class="example"><div class="code-panel" style="border:0"><pre><code>${escapeHtml(`<link rel="stylesheet" href="src/foundry.css">\n\n<button class="rb-button rb-button--primary">Open an account</button>`)}</code></pre></div><div class="example__toolbar"><strong>HTML</strong><button class="rb-button rb-button--secondary rb-button--small" data-copy="home">${icon('copy')} Copy</button></div></div></section>
  </article>`;
  document.querySelector('[data-copy="home"]').addEventListener('click', () => copyText(`<link rel="stylesheet" href="src/foundry.css">\n\n<button class="rb-button rb-button--primary">Open an account</button>`));
}

function tile(item) {
  return `<a class="component-tile" href="#/components/${item.id}"><span>${item.group}</span><b>${item.name}</b>${icon('arrow-right')}</a>`;
}

function renderCatalog() {
  main.innerHTML = `<article class="docs-page">${pageHeader('Library', 'Components', `${components.length} isolated building blocks with live previews, copyable code, usage guidance, and accessibility notes.`)}
    ${groups.map((group) => `<section class="docs-section"><h2>${group}</h2><div class="component-gallery">${components.filter((item) => item.group === group).sort((a, b) => rank(a) - rank(b)).map(tile).join('')}</div></section>`).join('')}
  </article>`;
}

const tokenData = [
  ['Default accent','#FEE600','--rb-accent'],['Accent hover','#FFD403','--rb-accent-hover'],['Accent contrast','#2B2D33','--rb-accent-contrast'],['Off black','#2B2D33','--rb-color-text'],['Link teal','#006E75','--rb-color-link'],['Link hover','#008E98','--rb-color-link-hover'],['Warm grey','#F1EDE6','--rb-color-surface-strong'],['Warm subtle','#F8F6F2','--rb-color-surface'],['Blue subtle','#DDF4FB','--rb-color-info'],['Danger','#B70017','--rb-color-danger']
];

function renderFoundations() {
  main.innerHTML = `<article class="docs-page">${pageHeader('Foundations', 'Tokens and visual language', 'The live custom banking theme is normalized into portable, documented custom properties.')}
    <section class="docs-section"><h2>Colour</h2><div class="token-grid">${tokenData.map(([name,value,token]) => `<div class="token-card"><i style="--token:${value}"></i><div><b>${name}</b><code>${value}</code><code>${token}</code></div></div>`).join('')}</div></section>
    <section class="docs-section"><h2>Typography</h2><p>The portable type stack uses Inter when available and native system fonts everywhere else. No proprietary font files are required.</p><div class="type-specimen"><p style="font-size:3.5rem;line-height:4rem">Display · 56/64</p><p style="font-size:3rem;line-height:3.75rem">Heading 1 · 48/60</p><p style="font-size:2.375rem;line-height:3rem">Heading 2 · 38/48</p><p style="font-size:1.875rem;line-height:2.25rem">Heading 3 · 30/36</p><p style="font-size:1.125rem;line-height:1.75rem">Body XL · 18/28</p><p>Body · 16/24</p><p style="font-size:.875rem;line-height:1rem;font-weight:500">CAPTION · 14/16 · MEDIUM</p></div></section>
    <section class="docs-section"><h2>Geometry</h2><div class="rb-table-wrap"><table class="rb-table"><tbody><tr><th>Base spacing</th><td>4px</td></tr><tr><th>Common spacing</th><td>8 · 12 · 16 · 24 · 32 · 36 · 48 · 64px</td></tr><tr><th>Control radius</th><td>8px</td></tr><tr><th>Input height</th><td>48px</td></tr><tr><th>Button height</th><td>51px</td></tr><tr><th>Breakpoints</th><td>576 · 768 · 992 · 1200px</td></tr></tbody></table></div></section>
  </article>`;
}

function renderPatterns() {
  const patterns = [
    ['Product discovery','Hero or surface banner → help-me-choose cards → product cards → supporting information.'],
    ['Loan calculation','Segmented income choice → amount input → term input → payment summary → application action.'],
    ['Contact form','Intro → labelled fields → legal checkbox → validation summary → submit confirmation.'],
    ['Product detail','Hero → benefit grid → calculator → process stepper → accordion → documents → related products.'],
    ['Global navigation','Service bar → primary product navigation → mega-menu → online-banking action.'],
    ['Regulatory footer','Product groups → consumer protection → policies → social and legal metadata.']
  ];
  main.innerHTML = `<article class="docs-page">${pageHeader('Composition', 'Patterns', 'Recurring arrangements observed across the bank’s public pages and embedded flows.')}
    <section class="docs-section"><div class="pattern-grid">${patterns.map(([name,text]) => `<article class="pattern-card"><p class="docs-kicker">Pattern</p><h2>${name}</h2><p>${text}</p></article>`).join('')}</div></section>
    <section class="docs-section"><h2>Recommended page flow</h2><ol class="rb-stepper" style="--rb-steps:4"><li class="is-complete"><span>1</span><b>Orient</b></li><li aria-current="step"><span>2</span><b>Compare</b></li><li><span>3</span><b>Decide</b></li><li><span>4</span><b>Complete</b></li></ol></section>
  </article>`;
}

function renderAbout() {
  main.innerHTML = `<article class="docs-page">${pageHeader('Audit', 'About this extraction', 'What the original site is built on, what was normalized, and how the portable package differs.')}
    <section class="docs-section"><h2>What framework was the audited source based on?</h2><div class="docs-note"><strong>It was not a Tailwind application.</strong> The audited interface runs on Liferay Portal. Its platform layer is Liferay Clay, which is Bootstrap-derived, combined with a large custom component theme.</div></section>
    <section class="docs-section"><div class="source-audit"><article><h2>Current component layer</h2><p>Portable tokens, system typography, 8px radii, warm surfaces, configurable accents, modern headers, and card components.</p></article><article><h2>Liferay forms</h2><p>Dynamic Data Mapping forms with Clay/Bootstrap utility classes and custom field styling.</p></article><article><h2>Legacy portal</h2><p>Older navigation, Font Awesome glyphs, dense layouts, and historical Liferay templates remain online.</p></article><article><h2>Embedded calculators</h2><p>Separate iframe applications implement their own controls, segmented choices, inputs, and steppers.</p></article></div></section>
    <section class="docs-section"><h2>Portable implementation</h2><p>This repository removes Liferay, Bootstrap, Clay, jQuery, icon fonts, and build-tool dependencies. Only semantic HTML, CSS custom properties, and an SVG sprite are required.</p></section>
  </article>`;
}

function renderIcons(item) {
  return `${componentHeader(item)}<section class="docs-section"><h2>Icon registry</h2><p>Click any icon to copy its HTML. Every glyph uses a 24×24 viewBox, currentColor strokes, and round line caps.</p><div class="icon-grid">${window.FOUNDRY_ICONS.map((name) => `<button class="icon-item" data-icon="${name}">${icon(name)}<code>${name}</code></button>`).join('')}</div></section>${accessibilitySection(item)}</article>`;
}

function renderTypography(item) {
  return `${componentHeader(item)}<section class="docs-section"><h2>Scale</h2><div class="type-specimen"><p style="font-size:3.5rem;line-height:4rem">Banking without friction</p><p style="font-size:2.375rem;line-height:3rem">Make confident financial decisions</p><p style="font-size:1.875rem;line-height:2.25rem">Products built around your goals</p><p style="font-size:1.125rem;line-height:1.75rem">Clear explanations help customers understand rates, fees, and next steps.</p><p>Body text is 16px with a 24px line height.</p></div></section>${accessibilitySection(item)}</article>`;
}

function renderTokens(item) {
  return `${componentHeader(item)}<section class="docs-section"><h2>CSS custom properties</h2><div class="example"><div class="code-panel" style="border:0"><pre><code>${escapeHtml(`:root {\n  --rb-accent: #7c3aed;\n  --rb-accent-hover: #6d28d9;\n  --rb-accent-contrast: #ffffff;\n  --rb-accent-soft: #ede9fe;\n  --rb-color-text: #2b2d33;\n  --rb-color-link: #006e75;\n  --rb-radius: .5rem;\n  --rb-control-height: 3rem;\n}`)}</code></pre></div><div class="example__toolbar"><strong>CSS</strong><button class="rb-button rb-button--secondary rb-button--small" data-copy-tokens>${icon('copy')} Copy</button></div></div></section>${accessibilitySection(item)}</article>`;
}

function componentHeader(item) {
  return `<article class="docs-page">${pageHeader(item.group, item.name, item.description)}<nav class="docs-tabs" aria-label="Component documentation"><button aria-selected="true" data-doc-tab="overview">Overview</button><button aria-selected="false" data-doc-tab="code">Code</button><button aria-selected="false" data-doc-tab="accessibility">Accessibility</button></nav>`;
}

function accessibilitySection(item) {
  return `<section class="docs-section" id="accessibility"><h2>Accessibility</h2><ul class="guideline-list">${item.accessibility.map((text) => `<li>${icon('check')}<span>${text}</span></li>`).join('')}</ul></section>`;
}

function renderComponent(item) {
  if (item.id === 'icons') { main.innerHTML = renderIcons(item); bindIconCopy(); return; }
  if (item.id === 'typography') { main.innerHTML = renderTypography(item); bindDocTabs(); return; }
  if (item.id === 'tokens') { main.innerHTML = renderTokens(item); document.querySelector('[data-copy-tokens]').addEventListener('click', () => copyText(`:root {\n  --rb-accent: #7c3aed;\n  --rb-accent-hover: #6d28d9;\n  --rb-accent-contrast: #ffffff;\n  --rb-accent-soft: #ede9fe;\n  --rb-color-text: #2b2d33;\n  --rb-color-link: #006e75;\n  --rb-radius: .5rem;\n  --rb-control-height: 3rem;\n}`)); bindDocTabs(); return; }
  const html = prettify(item.preview);
  const css = `@import url('./src/foundry.css');\n\n/* Component classes used in this example */\n${[...new Set([...item.preview.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(' ')).filter((name) => name.startsWith('rb-')))].map((name) => `.${name} { /* provided by foundry.css */ }`).join('\n')}`;
  main.innerHTML = `${componentHeader(item)}<section class="docs-section" id="examples"><h2>Example</h2><p>Inspect every component in desktop, tablet, and mobile frames, then reveal and copy its implementation.</p><div class="example"><div class="example__preview"><div class="example__viewport" data-preview-size="desktop">${item.preview}</div></div><div class="example__toolbar"><strong>Live preview</strong><div class="preview-sizes" aria-label="Preview size"><button class="active" aria-pressed="true" data-preview-size-button="desktop">D</button><button aria-pressed="false" data-preview-size-button="tablet">T</button><button aria-pressed="false" data-preview-size-button="mobile">M</button></div><button class="rb-button rb-button--tertiary rb-button--small" data-invert>${icon('moon')} Invert</button><button class="rb-button rb-button--secondary rb-button--small" data-show-code aria-expanded="false">${icon('document')} Show code</button></div><div class="code-panel" hidden><div class="code-panel__tabs" role="tablist"><button class="active" data-code-tab="html">HTML</button><button data-code-tab="css">CSS</button><button class="rb-button rb-button--small" style="margin-left:auto" data-copy-code>${icon('copy')} Copy</button></div><pre><code>${escapeHtml(html)}</code></pre></div></div></section>
    <section class="docs-section" id="usage"><h2>Usage</h2><div class="docs-note"><strong>Portable by default.</strong> Include <code>src/foundry.css</code>, use semantic HTML, and reference icons from <code>src/icons.svg</code>. No Tailwind, Bootstrap, React, or build step is required.</div></section>
    ${accessibilitySection(item)}</article>`;
  bindExample({ html, css });
  bindDocTabs();
  bindPreviewInteractions();
}

function bindExample(code) {
  const panel = document.querySelector('.code-panel');
  const pre = panel.querySelector('code');
  let active = 'html';
  document.querySelector('[data-show-code]').addEventListener('click', (event) => {
    panel.hidden = !panel.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
    event.currentTarget.lastChild.textContent = panel.hidden ? ' Show code' : ' Hide code';
  });
  document.querySelectorAll('[data-code-tab]').forEach((button) => button.addEventListener('click', () => {
    active = button.dataset.codeTab;
    document.querySelectorAll('[data-code-tab]').forEach((item) => item.classList.toggle('active', item === button));
    pre.textContent = code[active];
  }));
  document.querySelector('[data-copy-code]').addEventListener('click', () => copyText(code[active]));
  document.querySelector('[data-invert]').addEventListener('click', () => document.querySelector('.example__preview').classList.toggle('rb-theme-dark'));
  document.querySelectorAll('[data-preview-size-button]').forEach((button) => button.addEventListener('click', () => {
    const viewport = document.querySelector('.example__viewport');
    viewport.dataset.previewSize = button.dataset.previewSizeButton;
    document.querySelectorAll('[data-preview-size-button]').forEach((item) => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  }));
}

function bindDocTabs() {
  document.querySelectorAll('[data-doc-tab]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-doc-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    const target = button.dataset.docTab === 'accessibility' ? '#accessibility' : button.dataset.docTab === 'code' ? '.example' : '.docs-page__heading';
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (button.dataset.docTab === 'code') document.querySelector('[data-show-code]')?.click();
  }));
}

function bindPreviewInteractions() {
  document.querySelectorAll('[data-demo-dialog]').forEach((button) => button.addEventListener('click', () => button.parentElement.querySelector('dialog').showModal()));
  document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.rb-tabs__list button').forEach((button) => button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('button').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    button.closest('.rb-tabs').querySelector('.rb-tabs__panel').textContent = `${button.textContent} content.`;
  }));
  document.querySelectorAll('.rb-toggle-group button').forEach((button) => button.addEventListener('click', () => button.parentElement.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)))));
  const setAccent = (hex) => {
    const root = document.querySelector('.rb-accent-demo');
    if (!root) return;
    const value = hex.toUpperCase();
    const rgb = value.match(/[A-F\d]{2}/g).map((part) => parseInt(part, 16));
    const mix = (target, amount) => `#${rgb.map((channel) => Math.round(channel + (target - channel) * amount).toString(16).padStart(2, '0')).join('')}`;
    const luminance = rgb.reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0) / 255;
    root.style.setProperty('--rb-accent', value);
    root.style.setProperty('--rb-accent-hover', mix(0, .14));
    root.style.setProperty('--rb-accent-contrast', luminance > .58 ? '#2B2D33' : '#FFFFFF');
    root.style.setProperty('--rb-accent-soft', mix(255, .82));
    document.querySelector('[data-accent-picker]').value = value;
    document.querySelector('[data-accent-value]').value = value;
  };
  document.querySelector('[data-accent-picker]')?.addEventListener('input', (event) => setAccent(event.target.value));
  document.querySelectorAll('[data-accent]').forEach((button) => button.addEventListener('click', () => setAccent(button.dataset.accent)));
}

function bindIconCopy() {
  document.querySelectorAll('[data-icon]').forEach((button) => button.addEventListener('click', () => {
    const name = button.dataset.icon;
    copyText(`<svg class="rb-icon" aria-hidden="true">\n  <use href="src/icons.svg#${name}"></use>\n</svg>`);
  }));
  bindDocTabs();
}

function router() {
  const route = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  document.body.classList.remove('nav-open');
  if (!route.length) renderHome();
  else if (route[0] === 'components' && route[1]) {
    const item = components.find((component) => component.id === route[1]);
    item ? renderComponent(item) : renderCatalog();
  } else if (route[0] === 'components') renderCatalog();
  else if (route[0] === 'foundations') renderFoundations();
  else if (route[0] === 'patterns') renderPatterns();
  else if (route[0] === 'about') renderAbout();
  else renderHome();
  updateActiveNavigation();
  window.scrollTo(0, 0);
}

search.addEventListener('input', () => renderNavigation(search.value));
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
  if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; renderNavigation(); search.blur(); }
});
document.querySelector('.docs-search-trigger').addEventListener('click', () => search.focus());
document.querySelector('.nav-toggle').addEventListener('click', (event) => {
  const open = document.body.classList.toggle('nav-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
document.querySelector('.theme-toggle').addEventListener('click', () => document.body.classList.toggle('rb-theme-dark'));
window.addEventListener('hashchange', router);
renderNavigation();
router();
