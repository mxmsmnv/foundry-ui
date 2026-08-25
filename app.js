const components = window.FOUNDRY_COMPONENTS;
const main = document.querySelector('#main');
const nav = document.querySelector('#component-nav');
const search = document.querySelector('#component-search');
const groups = ['Foundation', 'Components', 'Patterns'];
const catalogOrder = [
  'Accent Colors', 'Colors & Tokens', 'Typography', 'Grid & Breakpoints', 'Component States',
  'Buttons', 'Form Elements', 'Labels & Badges', 'Alerts', 'Tables', 'Tab & Subnav', 'Cards', 'Cards Catalog', 'Accordion', 'Nav', 'Icons', 'Lists', 'Progress', 'Audio', 'Video', 'Heading Styles', 'Sections & Tiles', 'Overlay & Marker', 'Dotnav & Slidenav', 'Text Utilities', 'Utility Classes',
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
    <div class="fd-alert fd-alert--info">${icon('info')}<div class="fd-alert__content"><strong>Framework-independent by design</strong><span>Foundry UI ships semantic HTML, CSS custom properties, isolated patterns, and a dependency-free SVG sprite.</span></div></div>
    <section class="docs-section"><h2>Start building</h2><p>Browse the complete catalog, inspect live states, and copy production-oriented HTML from every component page.</p><div class="component-gallery">${components.slice(0, 12).map(tile).join('')}</div></section>
    <section class="docs-section"><h2>Install the portable layer</h2><div class="example"><div class="code-panel" style="border:0"><pre><code>${escapeHtml(`<link rel="stylesheet" href="src/foundry.css">\n\n<button class="fd-button fd-button--primary">Open an account</button>`)}</code></pre></div><div class="example__toolbar"><strong>HTML</strong><button class="fd-button fd-button--secondary fd-button--small" data-copy="home">${icon('copy')} Copy</button></div></div></section>
  </article>`;
  document.querySelector('[data-copy="home"]').addEventListener('click', () => copyText(`<link rel="stylesheet" href="src/foundry.css">\n\n<button class="fd-button fd-button--primary">Open an account</button>`));
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
  ['Default accent','#FEE600','--fd-accent'],['Accent hover','#FFD403','--fd-accent-hover'],['Accent contrast','#2B2D33','--fd-accent-contrast'],['Off black','#2B2D33','--fd-color-text'],['Link teal','#006E75','--fd-color-link'],['Link hover','#008E98','--fd-color-link-hover'],['Warm grey','#F1EDE6','--fd-color-surface-strong'],['Warm subtle','#F8F6F2','--fd-color-surface'],['Blue subtle','#DDF4FB','--fd-color-info'],['Danger','#B70017','--fd-color-danger']
];

function renderFoundations() {
  main.innerHTML = `<article class="docs-page">${pageHeader('Foundations', 'Tokens and visual language', 'The live custom banking theme is normalized into portable, documented custom properties.')}
    <section class="docs-section"><h2>Colour</h2><div class="token-grid">${tokenData.map(([name,value,token]) => `<div class="token-card"><i style="--token:${value}"></i><div><b>${name}</b><code>${value}</code><code>${token}</code></div></div>`).join('')}</div></section>
    <section class="docs-section"><h2>Typography</h2><p>The portable type stack uses Inter when available and native system fonts everywhere else. No proprietary font files are required.</p><div class="type-specimen"><p style="font-size:3.5rem;line-height:4rem">Display · 56/64</p><p style="font-size:3rem;line-height:3.75rem">Heading 1 · 48/60</p><p style="font-size:2.375rem;line-height:3rem">Heading 2 · 38/48</p><p style="font-size:1.875rem;line-height:2.25rem">Heading 3 · 30/36</p><p style="font-size:1.125rem;line-height:1.75rem">Body XL · 18/28</p><p>Body · 16/24</p><p style="font-size:.875rem;line-height:1rem;font-weight:500">CAPTION · 14/16 · MEDIUM</p></div></section>
    <section class="docs-section"><h2>Geometry</h2><div class="fd-table-wrap"><table class="fd-table"><tbody><tr><th>Base spacing</th><td>4px</td></tr><tr><th>Common spacing</th><td>8 · 12 · 16 · 24 · 32 · 36 · 48 · 64px</td></tr><tr><th>Control radius</th><td>8px</td></tr><tr><th>Input height</th><td>48px</td></tr><tr><th>Button height</th><td>51px</td></tr><tr><th>Breakpoints</th><td>576 · 768 · 992 · 1200px</td></tr></tbody></table></div></section>
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
    <section class="docs-section"><h2>Recommended page flow</h2><ol class="fd-stepper" style="--fd-steps:4"><li class="is-complete"><span>1</span><b>Orient</b></li><li aria-current="step"><span>2</span><b>Compare</b></li><li><span>3</span><b>Decide</b></li><li><span>4</span><b>Complete</b></li></ol></section>
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
  return `${componentHeader(item)}<section class="docs-section"><h2>Icon registry</h2><p>Search by name, then click any icon to copy its portable SVG markup.</p><label class="icon-search"><span class="fd-visually-hidden">Filter icons</span>${icon('search')}<input class="fd-input" type="search" placeholder="Filter ${window.FOUNDRY_ICONS.length} icons" data-icon-filter><span data-icon-count>${window.FOUNDRY_ICONS.length}</span></label><div class="icon-grid">${window.FOUNDRY_ICONS.map((name) => `<button class="icon-item" data-icon="${name}">${icon(name)}<code>${name}</code></button>`).join('')}</div><p class="icon-empty" hidden data-icon-empty>No icons match this search.</p></section>${accessibilitySection(item)}</article>`;
}

function renderTypography(item) {
  return `${componentHeader(item)}<section class="docs-section"><h2>Scale</h2><div class="type-specimen"><p style="font-size:3.5rem;line-height:4rem">Banking without friction</p><p style="font-size:2.375rem;line-height:3rem">Make confident financial decisions</p><p style="font-size:1.875rem;line-height:2.25rem">Products built around your goals</p><p style="font-size:1.125rem;line-height:1.75rem">Clear explanations help customers understand rates, fees, and next steps.</p><p>Body text is 16px with a 24px line height.</p></div></section>${accessibilitySection(item)}</article>`;
}

function renderTokens(item) {
  const colours = [['Accent','--fd-accent'],['Accent hover','--fd-accent-hover'],['Accent soft','--fd-accent-soft'],['Background','--fd-color-background'],['Surface','--fd-color-surface'],['Strong surface','--fd-color-surface-strong'],['Text','--fd-color-text'],['Link','--fd-color-link'],['Information','--fd-color-info'],['Success','--fd-color-success-soft'],['Warning','--fd-color-warning-soft'],['Danger','--fd-color-danger-soft']];
  const cssText = `:root {\n  --fd-accent: #7c3aed;\n  --fd-accent-hover: #6d28d9;\n  --fd-accent-contrast: #ffffff;\n  --fd-accent-soft: #ede9fe;\n  --fd-accent-soft-contrast: #2e1065;\n  --fd-color-text: #2b2d33;\n  --fd-color-link: #006e75;\n  --fd-radius: .5rem;\n  --fd-control-height: 3rem;\n}`;
  return `${componentHeader(item)}<section class="docs-section"><div class="token-showcase"><header><div><h2>Live token preview</h2><p>Every swatch and component below resolves directly from the current CSS custom properties.</p></div><div class="fd-toggle-group" aria-label="Preview theme"><button aria-pressed="true" data-token-scheme="light">Light</button><button aria-pressed="false" data-token-scheme="dark">Dark</button></div></header><div class="token-showcase__preview" data-token-preview><div class="token-swatch-grid">${colours.map(([name,token]) => `<article class="token-swatch"><i style="--token-color:var(${token})"></i><strong>${name}</strong><code>${token}</code></article>`).join('')}</div><div class="token-component-preview"><div><p class="docs-kicker">Ready composition</p><h3>Tokens working together</h3><p>Typography, spacing, surfaces, borders, semantic colour, radius, and shadow in one production surface.</p><div class="fd-alert fd-alert--success">${icon('check')}<div class="fd-alert__content"><strong>Configuration ready</strong><span>All semantic roles are active.</span></div></div><div class="fd-card__actions"><button class="fd-button fd-button--primary">Primary action</button><button class="fd-button fd-button--secondary">Secondary</button></div></div></div></div><section><h3>Geometry and elevation</h3><div class="token-metric-grid"><article><span class="token-space" style="--size:.5rem"></span><strong>Space 2</strong><code>0.5rem</code></article><article><span class="token-space" style="--size:1rem"></span><strong>Space 4</strong><code>1rem</code></article><article><span class="token-radius"></span><strong>Radius</strong><code>--fd-radius</code></article><article><span class="token-shadow"></span><strong>Shadow</strong><code>--fd-shadow-hover</code></article></div></section></div></section><section class="docs-section"><h2>CSS custom properties</h2><div class="example"><div class="code-panel" style="border:0"><pre><code>${escapeHtml(cssText)}</code></pre></div><div class="example__toolbar"><strong>CSS</strong><button class="fd-button fd-button--secondary fd-button--small" data-copy-tokens>${icon('copy')} Copy</button></div></div></section>${accessibilitySection(item)}</article>`;
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
  if (item.id === 'tokens') { main.innerHTML = renderTokens(item); document.querySelector('[data-copy-tokens]').addEventListener('click', () => copyText(`:root {\n  --fd-accent: #7c3aed;\n  --fd-accent-hover: #6d28d9;\n  --fd-accent-contrast: #ffffff;\n  --fd-accent-soft: #ede9fe;\n  --fd-accent-soft-contrast: #2e1065;\n  --fd-color-text: #2b2d33;\n  --fd-color-link: #006e75;\n  --fd-radius: .5rem;\n  --fd-control-height: 3rem;\n}`)); document.querySelectorAll('[data-token-scheme]').forEach((button) => button.addEventListener('click', () => { const dark = button.dataset.tokenScheme === 'dark'; document.querySelector('[data-token-preview]').classList.toggle('fd-theme-dark', dark); document.querySelectorAll('[data-token-scheme]').forEach((item) => item.setAttribute('aria-pressed', String(item === button))); })); bindDocTabs(); return; }
  const html = prettify(item.preview);
  const css = `@import url('./src/foundry.css');\n\n/* Component classes used in this example */\n${[...new Set([...item.preview.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(' ')).filter((name) => name.startsWith('fd-')))].map((name) => `.${name} { /* provided by foundry.css */ }`).join('\n')}`;
  main.innerHTML = `${componentHeader(item)}<section class="docs-section" id="examples"><h2>Examples</h2><p>Inspect production-ready variants in desktop, tablet, and mobile frames, then reveal and copy the implementation.</p><div class="example"><div class="example__preview"><div class="example__viewport" data-preview-size="desktop">${item.preview}</div></div><div class="example__toolbar"><strong>Live preview</strong><div class="preview-sizes" aria-label="Preview size"><button class="active" aria-label="Desktop preview" title="Desktop" aria-pressed="true" data-preview-size-button="desktop">${icon('desktop')}</button><button aria-label="Tablet preview" title="Tablet" aria-pressed="false" data-preview-size-button="tablet">${icon('tablet')}</button><button aria-label="Mobile preview" title="Mobile" aria-pressed="false" data-preview-size-button="mobile">${icon('mobile')}</button></div><button class="example-theme-toggle" data-invert aria-label="Use dark preview" title="Toggle preview theme">${icon('moon')}</button><button class="fd-button fd-button--secondary fd-button--small" data-show-code aria-expanded="false">${icon('document')} Show code</button></div><div class="code-panel" hidden><div class="code-panel__tabs" role="tablist"><button class="active" data-code-tab="html">HTML</button><button data-code-tab="css">CSS</button><button class="fd-button fd-button--small" style="margin-left:auto" data-copy-code>${icon('copy')} Copy</button></div><pre><code>${escapeHtml(html)}</code></pre></div></div></section>
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
  document.querySelector('[data-invert]').addEventListener('click', (event) => {
    const dark = document.querySelector('.example__preview').classList.toggle('fd-theme-dark');
    event.currentTarget.querySelector('use').setAttribute('href', `src/icons.svg#${dark ? 'sun' : 'moon'}`);
    event.currentTarget.setAttribute('aria-label', dark ? 'Use light preview' : 'Use dark preview');
  });
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
  document.querySelectorAll('.example__viewport form').forEach((form) => form.addEventListener('submit', (event) => event.preventDefault()));
  document.querySelectorAll('.fd-table__sort').forEach((button) => button.addEventListener('click', () => {
    const heading = button.closest('th');
    const direction = heading.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    button.closest('tr').querySelectorAll('[aria-sort]').forEach((cell) => cell.setAttribute('aria-sort', 'none'));
    heading.setAttribute('aria-sort', direction);
    button.querySelector('.fd-icon').style.transform = direction === 'ascending' ? 'rotate(180deg)' : '';
  }));
  const table = document.querySelector('.fd-table--interactive');
  if (table) {
    const checks = [...table.querySelectorAll('tbody input[type="checkbox"]:not(:disabled)')];
    const selectAll = table.querySelector('thead input[type="checkbox"]');
    const syncRows = () => checks.forEach((input) => input.closest('tr').classList.toggle('is-selected', input.checked));
    selectAll?.addEventListener('change', () => { checks.forEach((input) => { input.checked = selectAll.checked; }); syncRows(); });
    checks.forEach((input) => input.addEventListener('change', () => {
      syncRows();
      if (selectAll) {
        selectAll.checked = checks.every((item) => item.checked);
        selectAll.indeterminate = checks.some((item) => item.checked) && !selectAll.checked;
      }
    }));
  }
  document.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const input = stepper.querySelector('input[type="number"]');
    const output = stepper.querySelector('[data-stepper-output]');
    const buttons = [...stepper.querySelectorAll('[data-step]')];
    const sync = () => {
      const value = Number(input.value);
      const min = Number(input.min);
      const max = Number(input.max);
      buttons.forEach((button) => { button.disabled = button.dataset.step === 'down' ? value <= min : value >= max; });
      if (output) output.textContent = `${new Intl.NumberFormat('en-AU').format(value)}${input.dataset.suffix || ''}`;
    };
    buttons.forEach((button) => button.addEventListener('click', () => { button.dataset.step === 'down' ? input.stepDown() : input.stepUp(); input.dispatchEvent(new Event('input', { bubbles: true })); }));
    input.addEventListener('input', sync);
    sync();
  });
  document.querySelectorAll('[data-date-trigger]').forEach((button) => button.addEventListener('click', () => {
    const input = button.closest('.fd-date-input').querySelector('input[type="date"]');
    if (typeof input.showPicker === 'function') input.showPicker(); else input.focus();
  }));
  document.querySelectorAll('[data-date-demo] input[type="date"]').forEach((input) => input.addEventListener('change', () => {
    const output = input.closest('[data-date-demo]').querySelector('[data-date-output]');
    if (output) output.textContent = input.value ? new Intl.DateTimeFormat('en-AU', { dateStyle: 'long' }).format(new Date(`${input.value}T00:00:00`)) : 'No date selected';
  }));
  document.querySelectorAll('[data-file-demo]').forEach((demo) => {
    const input = demo.querySelector('input[type="file"]');
    const list = demo.querySelector('[data-file-list]');
    const zone = demo.querySelector('.fd-file-upload');
    const renderFiles = (files) => {
      list.innerHTML = files.length ? [...files].map((file) => `<li>${icon('document')}<span><strong>${escapeHtml(file.name)}</strong><small>${Math.max(1, Math.round(file.size / 1024))} KB</small></span><span class="fd-badge fd-badge--success">Ready</span></li>`).join('') : '<li class="fd-file-list__empty">No files selected.</li>';
    };
    input.addEventListener('change', () => renderFiles(input.files));
    zone.addEventListener('dragover', (event) => { event.preventDefault(); zone.classList.add('is-dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'));
    zone.addEventListener('drop', (event) => { event.preventDefault(); zone.classList.remove('is-dragover'); renderFiles(event.dataTransfer.files); });
    demo.querySelector('[data-file-sample]')?.addEventListener('click', () => renderFiles([new File(['Foundry UI sample'], 'sample-document.pdf', { type: 'application/pdf' })]));
    demo.querySelector('[data-file-clear]')?.addEventListener('click', () => { input.value = ''; renderFiles([]); });
  });
  document.querySelectorAll('[data-alert-close]').forEach((button) => button.addEventListener('click', () => button.closest('.fd-alert').remove()));
  document.querySelectorAll('[data-tag-remove]').forEach((button) => button.addEventListener('click', () => button.closest('.fd-tag').remove()));
  document.querySelectorAll('[data-tag-select]').forEach((button) => button.addEventListener('click', () => button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'))));
  document.querySelectorAll('.fd-toast > .fd-icon-button').forEach((button) => button.addEventListener('click', () => button.closest('.fd-toast').remove()));
  document.querySelectorAll('[data-toast-trigger]').forEach((button) => button.addEventListener('click', () => {
    const viewport = document.querySelector('.fd-toast-viewport');
    const tone = button.dataset.toastTrigger;
    const labels = { success: ['Saved successfully', 'Your changes are now available.'], info: ['Update available', 'A newer version can be installed.'], warning: ['Connection interrupted', 'Some changes may take longer to sync.'], danger: ['Upload failed', 'Check the file and try again.'] };
    const [title, message] = labels[tone];
    const toast = document.createElement('article');
    toast.className = `fd-toast fd-toast--${tone}`;
    toast.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    toast.innerHTML = `${icon(tone === 'success' ? 'check' : tone === 'danger' ? 'error' : tone === 'warning' ? 'warning' : 'info')}<div><strong>${title}</strong><span>${message}</span></div><button class="fd-icon-button" aria-label="Dismiss notification">${icon('close')}</button>`;
    toast.querySelector('button').addEventListener('click', () => toast.remove());
    viewport.append(toast);
    setTimeout(() => toast.remove(), 5000);
  }));
  const demoTable = document.querySelector('[data-demo-table]');
  if (demoTable) {
    const wrap = demoTable.closest('.fd-table-demo');
    wrap.querySelector('[data-table-density]')?.addEventListener('change', (event) => demoTable.classList.toggle('fd-table--compact', event.target.value === 'compact'));
    wrap.querySelector('[data-table-striped]')?.addEventListener('change', (event) => demoTable.classList.toggle('fd-table--striped', event.target.checked));
    wrap.querySelector('[data-table-highlight]')?.addEventListener('change', (event) => demoTable.classList.toggle('fd-table--highlight', event.target.checked));
    wrap.querySelector('[data-table-column]')?.addEventListener('click', (event) => { const hidden = demoTable.classList.toggle('hide-rate'); event.currentTarget.setAttribute('aria-pressed', String(hidden)); event.currentTarget.lastChild.textContent = hidden ? ' Show rate' : ' Hide rate'; });
    wrap.querySelector('[data-table-filter]')?.addEventListener('input', (event) => demoTable.querySelectorAll('tbody tr').forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(event.target.value.toLowerCase()); }));
  }
  document.querySelectorAll('[data-media-demo]').forEach((demo) => {
    const media = demo.querySelector('audio, video');
    const url = demo.querySelector('input[type="url"]');
    demo.querySelector('[data-media-load]')?.addEventListener('click', () => { media.src = url.value; media.load(); });
    demo.querySelector('input[type="file"]')?.addEventListener('change', (event) => { const [file] = event.target.files; if (file) { media.src = URL.createObjectURL(file); media.load(); } });
  });
  document.querySelectorAll('[data-demo-dialog]').forEach((button) => button.addEventListener('click', () => button.parentElement.querySelector('dialog').showModal()));
  document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.fd-tabs__list button').forEach((button) => button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('button').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    button.closest('.fd-tabs').querySelector('.fd-tabs__panel').textContent = `${button.textContent} content.`;
  }));
  document.querySelectorAll('.fd-toggle-group button').forEach((button) => button.addEventListener('click', () => button.parentElement.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)))));
  const setAccent = (hex) => {
    const root = document.querySelector('.fd-accent-demo');
    if (!root) return;
    const value = hex.toUpperCase();
    const rgb = value.match(/[A-F\d]{2}/g).map((part) => parseInt(part, 16));
    const mix = (target, amount) => `#${rgb.map((channel) => Math.round(channel + (target - channel) * amount).toString(16).padStart(2, '0')).join('')}`;
    const luminance = rgb.reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0) / 255;
    root.style.setProperty('--fd-accent', value);
    root.style.setProperty('--fd-accent-hover', mix(0, .14));
    root.style.setProperty('--fd-accent-contrast', luminance > .58 ? '#2B2D33' : '#FFFFFF');
    root.style.setProperty('--fd-accent-soft', mix(255, .82));
    root.style.setProperty('--fd-accent-soft-contrast', '#2B2D33');
    document.querySelector('[data-accent-picker]').value = value;
    document.querySelector('[data-accent-value]').value = value;
  };
  document.querySelector('[data-accent-picker]')?.addEventListener('input', (event) => setAccent(event.target.value));
  document.querySelectorAll('[data-accent]').forEach((button) => button.addEventListener('click', () => setAccent(button.dataset.accent)));
}

function bindIconCopy() {
  const filter = document.querySelector('[data-icon-filter]');
  const count = document.querySelector('[data-icon-count]');
  const empty = document.querySelector('[data-icon-empty]');
  filter?.addEventListener('input', () => {
    const term = filter.value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('[data-icon]').forEach((button) => {
      const matches = button.dataset.icon.includes(term);
      button.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = visible;
    empty.hidden = visible !== 0;
  });
  document.querySelectorAll('[data-icon]').forEach((button) => button.addEventListener('click', () => {
    const name = button.dataset.icon;
    copyText(`<svg class="fd-icon" aria-hidden="true">\n  <use href="src/icons.svg#${name}"></use>\n</svg>`);
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
document.querySelector('.theme-toggle').addEventListener('click', (event) => {
  const dark = document.body.classList.toggle('fd-theme-dark');
  event.currentTarget.querySelector('use').setAttribute('href', `src/icons.svg#${dark ? 'sun' : 'moon'}`);
  event.currentTarget.setAttribute('aria-label', dark ? 'Use light colour scheme' : 'Use dark colour scheme');
});
window.addEventListener('hashchange', router);
renderNavigation();
router();
