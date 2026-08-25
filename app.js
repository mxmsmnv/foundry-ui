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
  const primary = `<section class="sidebar-primary" aria-label="Primary navigation"><a href="#/foundations">Foundation</a><a href="#/components">Components</a><a href="#/patterns">Patterns</a><a href="#/about">About</a></section>`;
  const html = groups.map((group) => {
    const matches = components.filter((item) => item.group === group && `${item.name} ${item.description}`.toLowerCase().includes(term)).sort((a, b) => rank(a) - rank(b));
    if (!matches.length) return '';
    return `<section class="nav-group"><h2>${group}</h2>${matches.map((item) => `<a data-component-link="${item.id}" href="#/components/${item.id}">${item.name}</a>`).join('')}</section>`;
  }).join('');
  nav.innerHTML = primary + (html || '<p class="empty-state">No components found.</p>');
  updateActiveNavigation();
}

function updateActiveNavigation() {
  const id = location.hash.split('/')[2];
  document.querySelectorAll('[data-component-link]').forEach((link) => link.classList.toggle('active', link.dataset.componentLink === id));
}

function updatePrimaryNavigation() {
  const route = location.hash.replace(/^#\/?/, '').split('/')[0];
  document.querySelectorAll('.docs-header nav a').forEach((link) => {
    const target = link.getAttribute('href').replace(/^#\/?/, '').split('/')[0];
    link.classList.toggle('active', target === route && route !== '');
  });
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
  const starter = `<link rel="stylesheet" href="src/foundry.css">\n<script src="src/icon-sprite.js"></script>\n\n<button class="fd-button fd-button--primary">\n  Get started\n  <svg class="fd-icon" aria-hidden="true"><use href="#arrow-right"></use></svg>\n</button>`;
  main.innerHTML = `<article class="docs-page docs-page--landing"><section class="docs-hero docs-hero--home"><div class="docs-hero__copy"><div class="docs-hero__status"><span class="fd-badge fd-badge--success">v0.23.1</span><span>Portable · framework-independent</span></div><h1>Build complete interfaces from one coherent system.</h1><p class="docs-hero__lead">Production-ready foundations, components, and patterns for collaborative digital products—responsive, accessible, and ready to copy into any stack.</p><div class="docs-hero__actions"><a class="fd-button fd-button--primary" href="#/components">Browse the library ${icon('arrow-right')}</a><a class="fd-button fd-button--secondary" href="#/patterns">Explore patterns</a></div><ul class="docs-hero__proof"><li>${icon('check')} 320 live examples</li><li>${icon('check')} 963 SVG icons</li><li>${icon('check')} Light and dark themes</li></ul></div><div class="home-system-preview" aria-label="Foundry UI component workspace preview"><div class="home-system-preview__bar"><i></i><i></i><i></i><span>Project interface</span><b>Ready</b></div><div class="home-system-preview__body"><aside><span class="is-active"></span><span></span><span></span><span></span></aside><section><div class="home-system-preview__eyebrow"></div><div class="home-system-preview__title"></div><div class="home-system-preview__copy"></div><div class="home-system-preview__controls"><span aria-hidden="true"></span><span aria-hidden="true"></span></div><div class="home-system-preview__cards"><article><i>${icon('card')}</i><span></span><span></span></article><article><i>${icon('chart-bar-1')}</i><span></span><span></span></article></div></section></div></div></section>
    <section class="home-metrics" aria-label="Library summary"><article><strong>${components.length}</strong><span>documented pages</span></article><article><strong>320</strong><span>isolated examples</span></article><article><strong>${window.FOUNDRY_ICONS.length}</strong><span>portable icons</span></article><article><strong>0</strong><span>framework dependencies</span></article></section>
    <section class="docs-section home-journeys"><header class="docs-section__heading"><div><p class="docs-kicker">Choose a layer</p><h2>Move from decisions to complete journeys.</h2></div><p>Start with the level you need. Every layer uses the same tokens, state contract, responsive behavior, and portable code.</p></header><div class="home-journey-grid"><a href="#/foundations"><span class="home-journey-grid__icon">${icon('art')}</span><div><span>Design decisions</span><strong>Foundation</strong><small>Colour, typography, grid, tokens, and states.</small></div>${icon('arrow-right')}</a><a href="#/components"><span class="home-journey-grid__icon">${icon('component')}</span><div><span>Interface controls</span><strong>Components</strong><small>Production controls with live variants and code.</small></div>${icon('arrow-right')}</a><a href="#/patterns"><span class="home-journey-grid__icon">${icon('layouts')}</span><div><span>Complete workflows</span><strong>Patterns</strong><small>Reusable page and task compositions.</small></div>${icon('arrow-right')}</a></div></section>
    <section class="docs-section home-featured"><header class="docs-section__heading"><div><p class="docs-kicker">Start building</p><h2>Frequently used building blocks.</h2></div><a class="fd-link" href="#/components">View all 72 pages ${icon('arrow-right')}</a></header><div class="component-gallery">${['button','field','table','card-variants','icons','video'].map((id) => tile(components.find((item) => item.id === id))).join('')}</div></section>
    <section class="docs-section home-start"><div><p class="docs-kicker">Portable setup</p><h2>Start with three lines.</h2><p>Use the CSS and inline icon runtime directly, or wrap the same semantic markup in any framework.</p><div class="docs-hero__proof"><span>${icon('check')} No build step</span><span>${icon('check')} Works over file://</span><span>${icon('check')} Copy-ready markup</span></div></div><div class="example home-code"><div class="code-panel" style="border:0"><pre><code>${escapeHtml(starter)}</code></pre></div><div class="example__toolbar"><strong>HTML</strong><button class="fd-button fd-button--secondary fd-button--small" data-copy="home">${icon('copy')} Copy code</button></div></div></section>
  </article>`;
  document.querySelector('[data-copy="home"]').addEventListener('click', () => copyText(starter));
}

function tile(item) {
  return `<a class="component-tile" href="#/components/${item.id}"><span>${item.group}</span><b>${item.name}</b><small>${item.description}</small><i>${icon('arrow-right')}</i></a>`;
}

function renderCatalog() {
  const counts = Object.fromEntries(groups.map((group) => [group, components.filter((item) => item.group === group).length]));
  main.innerHTML = `<article class="docs-page docs-page--catalog"><section class="catalog-hero"><div><p class="docs-kicker">Component library</p><h1>Find the right building block.</h1><p class="docs-page__lead">Explore ${components.length} documented pages with 320 isolated previews, responsive controls, copyable code, states, and accessibility guidance.</p></div><dl><div><dt>Components</dt><dd>${counts.Components}</dd></div><div><dt>Patterns</dt><dd>${counts.Patterns}</dd></div><div><dt>Icons</dt><dd>963</dd></div></dl></section>
    <section class="catalog-controls" aria-label="Catalog controls"><label class="catalog-search">${icon('search')}<span class="fd-visually-hidden">Search the component catalog</span><input type="search" placeholder="Search by name, purpose, or state" data-catalog-search><kbd>/</kbd></label><div class="catalog-filters" aria-label="Filter catalog groups">${['All', ...groups].map((group, index) => `<button aria-pressed="${index === 0}" data-catalog-filter="${group}">${group}<span>${group === 'All' ? components.length : counts[group]}</span></button>`).join('')}</div><p><strong data-catalog-count>${components.length}</strong> pages</p></section>
    <div data-catalog-groups>${groups.map((group) => `<section class="docs-section catalog-group" data-catalog-group="${group}"><header><div><p class="docs-kicker">${group}</p><h2>${group === 'Foundation' ? 'Shared design decisions' : group === 'Components' ? 'Production interface controls' : 'Complete reusable compositions'}</h2></div><span>${counts[group]} pages</span></header><div class="component-gallery">${components.filter((item) => item.group === group).sort((a, b) => rank(a) - rank(b)).map((item) => `<div data-catalog-item data-catalog-copy="${escapeHtml(`${item.name} ${item.description} ${item.group}`.toLowerCase())}">${tile(item)}</div>`).join('')}</div></section>`).join('')}</div><div class="catalog-empty" data-catalog-empty hidden>${icon('search')}<h2>No matching pages</h2><p>Try a component name, behavior, state, or broader group.</p></div>
  </article>`;
  const filterCatalog = () => {
    const term = document.querySelector('[data-catalog-search]').value.trim().toLowerCase();
    const active = document.querySelector('[data-catalog-filter][aria-pressed="true"]').dataset.catalogFilter;
    let visible = 0;
    document.querySelectorAll('[data-catalog-group]').forEach((section) => {
      let groupVisible = 0;
      section.querySelectorAll('[data-catalog-item]').forEach((item) => {
        const show = (active === 'All' || section.dataset.catalogGroup === active) && item.dataset.catalogCopy.includes(term);
        item.hidden = !show;
        if (show) { visible += 1; groupVisible += 1; }
      });
      section.hidden = groupVisible === 0;
    });
    document.querySelector('[data-catalog-count]').textContent = visible;
    document.querySelector('[data-catalog-empty]').hidden = visible !== 0;
  };
  document.querySelector('[data-catalog-search]').addEventListener('input', filterCatalog);
  document.querySelectorAll('[data-catalog-filter]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-catalog-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    filterCatalog();
  }));
}

const tokenData = [
  ['#2A8288','--fd-accent'],['#236F74','--fd-accent-hover'],['#FFFFFF','--fd-accent-contrast'],['#2B2D33','--fd-color-text'],['#2A8288','--fd-color-link'],['#236F74','--fd-color-link-hover'],['#F1EDE6','--fd-color-surface-strong'],['#F8F6F2','--fd-color-surface'],['#DDF4FB','--fd-color-info'],['#B70017','--fd-color-danger']
];

function renderFoundations() {
  main.innerHTML = `<article class="docs-page">${pageHeader('Foundations', 'Tokens and visual language', 'A neutral creative-workspace theme expressed as portable, documented custom properties.')}
    <section class="docs-section"><h2>Colour</h2><div class="token-grid">${tokenData.map(([value,token]) => `<div class="token-card"><i style="--token:${value}"></i><div><code>${value}</code><code>${token}</code></div></div>`).join('')}</div></section>
    <section class="docs-section"><h2>Typography</h2><p>The portable type stack uses the bundled Hanken Grotesk variable font with native system-font fallbacks. Normal and italic styles cover weights from 100 to 900.</p><div class="type-specimen"><p style="font-size:3.5rem;line-height:4rem">Display · 56/64</p><p style="font-size:3rem;line-height:3.75rem">Heading 1 · 48/60</p><p style="font-size:2.375rem;line-height:3rem">Heading 2 · 38/48</p><p style="font-size:1.875rem;line-height:2.25rem">Heading 3 · 30/36</p><p style="font-size:1.125rem;line-height:1.75rem">Body XL · 18/28</p><p>Body · 16/24</p><p style="font-size:1.125rem;line-height:1.75rem;font-style:italic">Italic · Variable 100–900</p><p style="font-size:.875rem;line-height:1rem;font-weight:500">CAPTION · 14/16 · MEDIUM</p></div></section>
    <section class="docs-section"><h2>Geometry</h2><div class="fd-table-wrap"><table class="fd-table"><tbody><tr><th>Base spacing</th><td>4px</td></tr><tr><th>Common spacing</th><td>8 · 12 · 16 · 24 · 32 · 36 · 48 · 64px</td></tr><tr><th>Control radius</th><td>8px</td></tr><tr><th>Input height</th><td>48px</td></tr><tr><th>Button height</th><td>51px</td></tr><tr><th>Breakpoints</th><td>576 · 768 · 992 · 1200px</td></tr></tbody></table></div></section>
  </article>`;
}

function renderPatterns() {
  const patterns = [
    ['Template discovery','Discovery','search',['Orient','Narrow','Compare','Choose'],'Guide teams from an open need to a confident template choice.','search'],
    ['Project setup','Task','document',['Prepare','Configure','Review','Create'],'Structure a multi-step setup with progress, validation, and recovery.','module-workspace'],
    ['Team support','Task','chat',['Identify','Describe','Route','Resolve'],'Collect enough context while keeping help visible and human.','comment'],
    ['Asset detail','Content','card',['Preview','Metadata','Activity','Action'],'Balance visual content, project data, and a clear next step.','card-variants'],
    ['Global navigation','Navigation','menu',['Workspace','Primary','Mega menu','Action'],'Expose a broad workspace architecture without overwhelming the first level.','dropdown-navbar-dd'],
    ['Search results','Discovery','search',['Query','Summary','Filter','Result'],'Keep the query, result count, filters, and pagination in one predictable flow.','pattern-pagination'],
    ['Project overview','Content','layouts',['Summary','Activity','Tasks','Team'],'Prioritise progress, recent activity, and high-frequency project actions.','module-workspace'],
    ['Confirmation','Feedback','check',['Outcome','Reference','Next step','Record'],'Close a task with a durable result and clear follow-up options.','notifications']
  ];
  const kinds = ['All','Discovery','Task','Content','Navigation','Feedback'];
  main.innerHTML = `<article class="docs-page docs-page--patterns"><section class="docs-hero docs-hero--patterns"><div class="docs-hero__copy"><p class="docs-kicker">Composition library</p><h1>Build complete journeys, not disconnected screens.</h1><p class="docs-hero__lead">Reusable arrangements for discovery, tasks, content, navigation, and feedback—organized around user intent and real outcomes.</p><div class="docs-hero__actions"><a class="fd-button fd-button--primary" href="#pattern-library">Browse patterns ${icon('arrow-right')}</a><a class="fd-button fd-button--secondary" href="#pattern-anatomy">Understand the anatomy</a></div></div><aside class="pattern-hero-map" aria-label="Pattern composition"><header><span class="fd-badge">Journey contract</span><strong>Every pattern answers four questions.</strong></header><ol><li><i>${icon('compass')}</i><span><strong>Orient</strong><small>Where am I?</small></span></li><li><i>${icon('filter')}</i><span><strong>Reduce</strong><small>What matters now?</small></span></li><li><i>${icon('balanced')}</i><span><strong>Decide</strong><small>Which path fits?</small></span></li><li><i>${icon('check')}</i><span><strong>Complete</strong><small>What happens next?</small></span></li></ol></aside></section>
    <section class="pattern-summary" aria-label="Pattern library summary"><article><strong>${patterns.length}</strong><span>complete journeys</span></article><article><strong>${kinds.length - 1}</strong><span>intent categories</span></article><article><strong>4</strong><span>required journey jobs</span></article></section>
    <section class="docs-section" id="pattern-library"><header class="docs-section__heading"><div><p class="docs-kicker">Pattern library</p><h2>Explore by journey type.</h2></div><p><strong data-pattern-count>${patterns.length}</strong> reusable compositions</p></header><div class="pattern-filters" aria-label="Filter patterns">${kinds.map((kind, index) => `<button aria-pressed="${index === 0}" data-pattern-filter="${kind}">${kind}</button>`).join('')}</div><div class="pattern-library">${patterns.map(([name,kind,iconName,steps,text,target]) => `<article class="pattern-card-v2" data-pattern-kind="${kind}"><header><span class="fd-badge">${kind}</span><i>${icon(iconName)}</i></header><h3>${name}</h3><p>${text}</p><ol>${steps.map((step) => `<li>${step}</li>`).join('')}</ol><a class="fd-link" href="#/components/${target}">View related examples ${icon('arrow-right')}</a></article>`).join('')}</div></section>
    <section class="docs-section pattern-anatomy" id="pattern-anatomy"><header class="docs-section__heading"><div><p class="docs-kicker">Pattern anatomy</p><h2>A reliable journey has four jobs.</h2></div><p>The exact components change; the cognitive sequence remains stable.</p></header><div class="pattern-anatomy__flow"><article>${icon('compass')}<span>Start</span><h3>Orient</h3><p>Explain where the user is and what can be achieved.</p></article><article>${icon('filter')}<span>Focus</span><h3>Reduce</h3><p>Ask only for information that meaningfully narrows the path.</p></article><article>${icon('balanced')}<span>Choice</span><h3>Decide</h3><p>Make differences and consequences easy to compare.</p></article><article>${icon('check')}<span>Outcome</span><h3>Complete</h3><p>Confirm the result and provide a safe next step.</p></article></div></section>
    <section class="docs-section pattern-guidance"><div><p class="docs-kicker">Composition rule</p><h2>Start with the user’s decision, not the available components.</h2></div><div class="fd-alert fd-alert--info">${icon('info')}<div class="fd-alert__content"><strong>Keep patterns adaptable.</strong><span>Preserve sequence, hierarchy, states, and accessibility behaviour while allowing content and individual components to evolve.</span></div></div></section>
  </article>`;
  document.querySelectorAll('[data-pattern-filter]').forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.patternFilter;
    let visible = 0;
    document.querySelectorAll('[data-pattern-kind]').forEach((card) => { const show = filter === 'All' || card.dataset.patternKind === filter; card.hidden = !show; if (show) visible += 1; });
    document.querySelectorAll('[data-pattern-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('[data-pattern-count]').textContent = visible;
  }));
}

function renderAbout() {
  main.innerHTML = `<article class="docs-page docs-page--about"><section class="docs-hero docs-hero--about"><div class="docs-hero__copy"><p class="docs-kicker">About Foundry UI</p><h1>One portable system for complete product interfaces.</h1><p class="docs-hero__lead">Foundry UI turns durable design decisions into neutral foundations, production components, and complete patterns that can move between projects and frameworks.</p><div class="docs-hero__actions"><a class="fd-button fd-button--primary" href="#/components">Browse the library ${icon('arrow-right')}</a><a class="fd-button fd-button--secondary" href="README.md">Read the documentation</a></div><ul class="docs-hero__proof"><li>${icon('check')} Neutral by default</li><li>${icon('check')} States included</li><li>${icon('check')} No framework lock-in</li></ul></div><div class="about-system-map" aria-label="Foundry UI system layers"><span class="about-system-map__core">Foundry UI<small>Portable interface system</small></span><article>${icon('art')}<strong>Foundation</strong><small>Tokens and visual language</small></article><article>${icon('component')}<strong>Components</strong><small>Controls and content</small></article><article>${icon('layouts')}<strong>Patterns</strong><small>Complete journeys</small></article></div></section>
    <section class="about-metrics"><article><strong>72</strong><span>documented pages</span></article><article><strong>320</strong><span>isolated examples</span></article><article><strong>963</strong><span>SVG symbols</span></article><article><strong>0</strong><span>framework dependencies</span></article></section>
    <section class="docs-section about-pipeline"><header class="docs-section__heading"><div><p class="docs-kicker">Normalization pipeline</p><h2>From platform layers to a portable API</h2></div><p>The visual language is retained; legacy runtime coupling is removed.</p></header><div class="about-pipeline__flow"><article><span>Observe</span><h3>Production interface</h3><ul><li>Portal templates</li><li>Custom themes</li><li>Embedded tools</li><li>Legacy utilities</li></ul></article><i>${icon('arrow-right')}</i><article><span>Normalize</span><h3>Design decisions</h3><ul><li>Semantic tokens</li><li>State contracts</li><li>Responsive rules</li><li>Interaction models</li></ul></article><i>${icon('arrow-right')}</i><article class="is-output"><span>Deliver</span><h3>Foundry UI</h3><ul><li>HTML + CSS + JS</li><li>Portable SVG</li><li>Copyable examples</li><li>No framework lock-in</li></ul></article></div></section>
    <section class="docs-section"><header class="docs-section__heading"><div><p class="docs-kicker">Technology assessment</p><h2>What the audited source used</h2></div></header><div class="about-tech-grid"><article class="about-tech-grid__lead"><span class="fd-badge fd-badge--warning">Source architecture</span><h3>Portal-first, not utility-first.</h3><p>The audited interface was built on Liferay Portal with Clay, a Bootstrap-derived platform layer, plus custom themes, legacy utilities, icon fonts, and separately embedded applications.</p></article><article><span>${icon('layouts')}</span><h3>Portal templates</h3><p>Navigation and content assembled through server-managed layouts.</p></article><article><span>${icon('document')}</span><h3>Form runtime</h3><p>Dynamic form rendering combined with custom field treatments.</p></article><article><span>${icon('calculator')}</span><h3>Embedded tools</h3><p>Isolated calculators with their own state and styling layers.</p></article></div></section>
    <section class="docs-section"><header class="docs-section__heading"><div><p class="docs-kicker">Portability matrix</p><h2>What ships in Foundry UI</h2></div><p>A small, explicit runtime surface with no framework dependency.</p></header><div class="fd-table-wrap"><table class="fd-table about-matrix"><thead><tr><th>Layer</th><th>Implementation</th><th>Dependency</th><th>Portable</th></tr></thead><tbody><tr><th scope="row">Design tokens</th><td>CSS custom properties</td><td>None</td><td>${icon('check')} Yes</td></tr><tr><th scope="row">Components</th><td>Semantic HTML + CSS</td><td>None</td><td>${icon('check')} Yes</td></tr><tr><th scope="row">Interactions</th><td>Vanilla JavaScript</td><td>None</td><td>${icon('check')} Yes</td></tr><tr><th scope="row">Icons</th><td>Inline and standalone SVG</td><td>None</td><td>${icon('check')} Yes</td></tr><tr><th scope="row">Documentation</th><td>Hash-routed static application</td><td>None</td><td>${icon('check')} file:// + HTTP</td></tr></tbody></table></div></section>
    <section class="docs-section about-principles"><header class="docs-section__heading"><div><p class="docs-kicker">System principles</p><h2>Designed to stay useful after the audit.</h2></div></header><div><article><h3>Neutral by default</h3><p>Brand, regional data, and product assumptions are replaceable.</p></article><article><h3>States are part of the API</h3><p>Loading, error, empty, focus, disabled, and responsive behaviour are documented.</p></article><article><h3>Copying is a first-class workflow</h3><p>Every component exposes inspectable markup and portable styling.</p></article></div></section>
  </article>`;
}

function renderIcons(item) {
  return `${componentHeader(item)}<section class="docs-section"><h2>Icon registry</h2><p>Search by name, then click any icon to copy its portable SVG markup.</p><label class="icon-search"><span class="fd-visually-hidden">Filter icons</span>${icon('search')}<input class="fd-input" type="search" placeholder="Filter ${window.FOUNDRY_ICONS.length} icons" data-icon-filter><span data-icon-count>${window.FOUNDRY_ICONS.length}</span></label><div class="icon-grid">${window.FOUNDRY_ICONS.map((name) => `<button class="icon-item" data-icon="${name}">${icon(name)}<code>${name}</code></button>`).join('')}</div><p class="icon-empty" hidden data-icon-empty>No icons match this search.</p></section>${accessibilitySection(item)}</article>`;
}

function renderTokens(item) {
  const colours = [['Accent','--fd-accent'],['Accent hover','--fd-accent-hover'],['Accent soft','--fd-accent-soft'],['Background','--fd-color-background'],['Surface','--fd-color-surface'],['Strong surface','--fd-color-surface-strong'],['Text','--fd-color-text'],['Link','--fd-color-link'],['Information','--fd-color-info'],['Success','--fd-color-success-soft'],['Warning','--fd-color-warning-soft'],['Danger','--fd-color-danger-soft']];
  const cssText = `:root {\n  --fd-accent: #2a8288;\n  --fd-accent-hover: #236f74;\n  --fd-accent-contrast: #ffffff;\n  --fd-accent-soft: #92cfae;\n  --fd-accent-soft-contrast: #173f42;\n  --fd-color-text: #2b2d33;\n  --fd-color-link: #2a8288;\n  --fd-radius: .5rem;\n  --fd-control-height: 3rem;\n}`;
  return `${componentHeader(item)}<section class="docs-section"><div class="token-showcase"><header><div><h2>Live token preview</h2><p>Every swatch and component below resolves directly from the current CSS custom properties.</p></div><div class="fd-toggle-group" aria-label="Preview theme"><button aria-pressed="true" data-token-scheme="light">Light</button><button aria-pressed="false" data-token-scheme="dark">Dark</button></div></header><div class="token-showcase__preview" data-token-preview><div class="token-swatch-grid">${colours.map(([name,token]) => `<article class="token-swatch"><i style="--token-color:var(${token})"></i><strong>${name}</strong><code>${token}</code></article>`).join('')}</div><div class="token-component-preview"><div><p class="docs-kicker">Ready composition</p><h3>Tokens working together</h3><p>Typography, spacing, surfaces, borders, semantic colour, radius, and shadow in one production surface.</p><div class="fd-alert fd-alert--success">${icon('check')}<div class="fd-alert__content"><strong>Configuration ready</strong><span>All semantic roles are active.</span></div></div><div class="fd-card__actions"><button class="fd-button fd-button--primary">Primary action</button><button class="fd-button fd-button--secondary">Secondary</button></div></div></div></div><section><h3>Geometry and elevation</h3><div class="token-metric-grid"><article><span class="token-space" style="--size:.5rem"></span><strong>Space 2</strong><code>0.5rem</code></article><article><span class="token-space" style="--size:1rem"></span><strong>Space 4</strong><code>1rem</code></article><article><span class="token-radius"></span><strong>Radius</strong><code>--fd-radius</code></article><article><span class="token-shadow"></span><strong>Shadow</strong><code>--fd-shadow-hover</code></article></div></section></div></section><section class="docs-section"><h2>CSS custom properties</h2><div class="example"><div class="code-panel" style="border:0"><pre><code>${escapeHtml(cssText)}</code></pre></div><div class="example__toolbar"><strong>CSS</strong><button class="fd-button fd-button--secondary fd-button--small" data-copy-tokens>${icon('copy')} Copy</button></div></div></section>${accessibilitySection(item)}</article>`;
}

function componentHeader(item) {
  return `<article class="docs-page">${pageHeader(item.group, item.name, item.description)}<nav class="docs-tabs" aria-label="Component documentation"><button aria-selected="true" data-doc-tab="overview">Overview</button><button aria-selected="false" data-doc-tab="code">Code</button><button aria-selected="false" data-doc-tab="accessibility">Accessibility</button></nav>`;
}

function accessibilitySection(item) {
  return `<section class="docs-section" id="accessibility"><h2>Accessibility</h2><ul class="guideline-list">${item.accessibility.map((text) => `<li>${icon('check')}<span>${text}</span></li>`).join('')}</ul></section>`;
}

function exampleCode(preview) {
  const html = prettify(preview);
  const classes = [...new Set([...preview.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(' ')).filter((name) => name.startsWith('fd-')))];
  const css = `@import url('./src/foundry.css');\n\n/* Component classes used in this example */\n${classes.map((name) => `.${name} { /* provided by foundry.css */ }`).join('\n')}`;
  return { html, css };
}

function exampleSection(entry, index, separated) {
  const heading = separated
    ? `<header class="component-example__heading"><p class="docs-kicker">Example</p><h2>${entry.title}</h2>${entry.description ? `<p>${entry.description}</p>` : ''}</header>`
    : `<h2>Examples</h2><p>Inspect production-ready variants in desktop, tablet, and mobile frames, then reveal and copy the implementation.</p>`;
  return `<section class="docs-section component-example" id="${index === 0 ? 'examples' : `example-${entry.slug || index + 1}`}">${heading}<div class="example" data-example><div class="example__preview"><div class="example__viewport" data-preview-size="desktop">${entry.preview}</div></div><div class="example__toolbar"><strong>Live preview</strong><div class="preview-sizes" aria-label="Preview size"><button class="active" aria-label="Desktop preview" title="Desktop" aria-pressed="true" data-preview-size-button="desktop">${icon('desktop')}</button><button aria-label="Tablet preview" title="Tablet" aria-pressed="false" data-preview-size-button="tablet">${icon('tablet')}</button><button aria-label="Mobile preview" title="Mobile" aria-pressed="false" data-preview-size-button="mobile">${icon('mobile')}</button></div><button class="example-theme-toggle" data-invert aria-label="Use dark preview" title="Toggle preview theme">${icon('moon')}</button><button class="fd-button fd-button--secondary fd-button--small" data-show-code aria-expanded="false">${icon('document')} Show code</button></div><div class="code-panel" hidden><div class="code-panel__tabs" role="tablist"><button class="active" data-code-tab="html">HTML</button><button data-code-tab="css">CSS</button><button class="fd-button fd-button--small" style="margin-left:auto" data-copy-code>${icon('copy')} Copy</button></div><pre><code>${escapeHtml(exampleCode(entry.preview).html)}</code></pre></div></div></section>`;
}

function renderComponent(item) {
  if (item.id === 'icons') { main.innerHTML = renderIcons(item); bindIconCopy(); return; }
  const examples = item.examples?.length ? item.examples : [{ preview: item.preview }];
  const codes = examples.map((entry) => exampleCode(entry.preview));
  main.innerHTML = `${componentHeader(item)}${examples.map((entry, index) => exampleSection(entry, index, Boolean(item.examples?.length))).join('')}
    <section class="docs-section" id="usage"><h2>Usage</h2><div class="docs-note"><strong>Portable by default.</strong> Include <code>src/foundry.css</code> and <code>src/icon-sprite.js</code>, then reference icons with local fragment IDs such as <code>#search</code>. The standalone <code>src/icons.svg</code> remains available for hosted builds. No Tailwind, Bootstrap, or React is required.</div></section>
    ${accessibilitySection(item)}</article>`;
  document.querySelectorAll('[data-example]').forEach((root, index) => bindExample(root, codes[index]));
  bindDocTabs();
  bindPreviewInteractions();
}

function bindExample(root, code) {
  const panel = root.querySelector('.code-panel');
  const pre = panel.querySelector('code');
  let active = 'html';
  root.querySelector('[data-show-code]').addEventListener('click', (event) => {
    panel.hidden = !panel.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
    event.currentTarget.lastChild.textContent = panel.hidden ? ' Show code' : ' Hide code';
  });
  root.querySelectorAll('[data-code-tab]').forEach((button) => button.addEventListener('click', () => {
    active = button.dataset.codeTab;
    root.querySelectorAll('[data-code-tab]').forEach((item) => item.classList.toggle('active', item === button));
    pre.textContent = code[active];
  }));
  root.querySelector('[data-copy-code]').addEventListener('click', () => copyText(code[active]));
  root.querySelector('[data-invert]').addEventListener('click', (event) => {
    const dark = root.classList.toggle('fd-theme-dark');
    event.currentTarget.querySelector('use').setAttribute('href', `#${dark ? 'sun' : 'moon'}`);
    event.currentTarget.setAttribute('aria-label', dark ? 'Use light preview' : 'Use dark preview');
  });
  root.querySelectorAll('[data-preview-size-button]').forEach((button) => button.addEventListener('click', () => {
    const viewport = root.querySelector('.example__viewport');
    viewport.dataset.previewSize = button.dataset.previewSizeButton;
    root.querySelectorAll('[data-preview-size-button]').forEach((item) => {
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
  document.querySelectorAll('input[data-indeterminate]').forEach((input) => { input.indeterminate = true; });
  document.querySelectorAll('.fd-details').forEach((details) => {
    const sync = () => details.querySelector(':scope > summary .fd-icon use')?.setAttribute('href', details.open ? '#minus' : '#plus');
    details.addEventListener('toggle', sync);
    sync();
  });
  document.querySelectorAll('[data-accordion-single]').forEach((group) => {
    const panels = [...group.children].filter((child) => child.matches('details'));
    panels.forEach((panel) => panel.addEventListener('toggle', () => {
      if (!panel.open) return;
      panels.forEach((item) => { if (item !== panel) item.open = false; });
    }));
  });
  document.querySelectorAll('[data-icon-toggle]').forEach((button) => {
    const sync = () => {
      const pressed = button.getAttribute('aria-pressed') === 'true';
      button.querySelector('use')?.setAttribute('href', `#${pressed ? button.dataset.iconOn : button.dataset.iconOff}`);
      button.setAttribute('aria-label', pressed ? button.dataset.labelOn : button.dataset.labelOff);
    };
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      sync();
    });
    sync();
  });
  document.querySelectorAll('[data-icon-toolbar]').forEach((toolbar) => {
    const buttons = [...toolbar.querySelectorAll('button:not(:disabled)')];
    buttons.forEach((button, index) => {
      button.tabIndex = index === 0 ? 0 : -1;
      button.addEventListener('keydown', (event) => {
        let target = null;
        if (event.key === 'ArrowRight') target = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') target = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = buttons.length - 1;
        if (target === null) return;
        event.preventDefault();
        buttons.forEach((item, itemIndex) => { item.tabIndex = itemIndex === target ? 0 : -1; });
        buttons[target].focus();
      });
    });
  });
  document.querySelectorAll('[data-input-clear]').forEach((button) => button.addEventListener('click', () => {
    const input = button.closest('.fd-input-control').querySelector('[data-clearable-input]');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }));
  document.querySelectorAll('[data-password-toggle]').forEach((button) => button.addEventListener('click', () => {
    const input = button.closest('.fd-input-control').querySelector('[data-password-input]');
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    button.setAttribute('aria-pressed', String(!visible));
    button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    button.querySelector('use')?.setAttribute('href', visible ? '#eye-opened' : '#eye-closed');
  }));
  document.querySelectorAll('[data-pagination-live]').forEach((pagination) => {
    const pageButtons = [...pagination.querySelectorAll('button')].filter((button) => /^\d+$/.test(button.textContent.trim()));
    pageButtons.forEach((button) => button.addEventListener('click', () => {
      pageButtons.forEach((item) => item.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'page');
    }));
  });
  document.querySelectorAll('[data-list-checklist]').forEach((checklist) => {
    const checks = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const text = checklist.querySelector('[data-list-progress-text]');
    const progress = checklist.querySelector('[role="progressbar"]');
    const bar = checklist.querySelector('[data-list-progress-bar]');
    const sync = () => {
      const complete = checks.filter((input) => input.checked).length;
      text.textContent = `${complete} of ${checks.length} complete`;
      progress.setAttribute('aria-valuenow', String(complete));
      bar.style.width = `${complete / checks.length * 100}%`;
    };
    checks.forEach((input) => input.addEventListener('change', sync));
    sync();
  });
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
    const dots = [...carousel.querySelectorAll('[data-carousel-go]')];
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const status = carousel.querySelector('[data-carousel-status]');
    const loops = carousel.hasAttribute('data-carousel-loop');
    let index = Math.max(0, slides.findIndex((slide) => !slide.hidden));
    let pointerStart = null;
    const show = (target) => {
      index = loops ? (target + slides.length) % slides.length : Math.max(0, Math.min(slides.length - 1, target));
      slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== index; slide.setAttribute('aria-hidden', String(slideIndex !== index)); });
      dots.forEach((dot, dotIndex) => { if (dotIndex === index) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
      if (previous) previous.disabled = !loops && index === 0;
      if (next) next.disabled = !loops && index === slides.length - 1;
      if (status) status.textContent = `${index + 1} of ${slides.length}`;
    };
    dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.carouselGo))));
    previous?.addEventListener('click', () => show(index - 1));
    next?.addEventListener('click', () => show(index + 1));
    carousel.addEventListener('keydown', (event) => {
      const target = event.key === 'ArrowLeft' ? index - 1 : event.key === 'ArrowRight' ? index + 1 : event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : null;
      if (target !== null) { event.preventDefault(); show(target); }
    });
    carousel.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
    carousel.addEventListener('pointerup', (event) => { if (pointerStart !== null && Math.abs(event.clientX - pointerStart) > 48) show(index + (event.clientX < pointerStart ? 1 : -1)); pointerStart = null; });
    carousel.addEventListener('pointercancel', () => { pointerStart = null; });
    show(index);
  });
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
  document.querySelectorAll('[data-date-clear]').forEach((button) => button.addEventListener('click', () => {
    const input = button.closest('[data-date-demo]').querySelector('input[type="date"]');
    input.value = '';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();
  }));
  document.querySelectorAll('[data-date-range-demo]').forEach((range) => {
    const start = range.querySelector('[data-date-start]');
    const end = range.querySelector('[data-date-end]');
    const status = range.querySelector('[data-date-range-status]');
    const sync = () => {
      end.min = start.value;
      const invalid = Boolean(start.value && end.value && end.value < start.value);
      end.setCustomValidity(invalid ? 'End date must be on or after the start date.' : '');
      if (invalid) end.setAttribute('aria-invalid', 'true'); else end.removeAttribute('aria-invalid');
      if (invalid) status.textContent = 'End date must be on or after the start date.';
      else if (start.value && end.value) status.textContent = `${Math.round((new Date(`${end.value}T00:00:00`) - new Date(`${start.value}T00:00:00`)) / 86400000) + 1}-day project window.`;
      else status.textContent = 'Choose both dates to define the project window.';
    };
    start.addEventListener('change', sync);
    end.addEventListener('change', sync);
    sync();
  });
  document.querySelectorAll('[data-textarea-demo]').forEach((demo) => {
    const textarea = demo.querySelector('[data-textarea-counter]');
    const output = demo.querySelector('[data-textarea-count]');
    const sync = () => { if (output) output.textContent = String(textarea.value.length); };
    textarea.addEventListener('input', sync);
    sync();
  });
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
    wrap.querySelector('[data-table-column]')?.addEventListener('click', (event) => { const hidden = demoTable.classList.toggle('hide-updated'); event.currentTarget.setAttribute('aria-pressed', String(hidden)); event.currentTarget.lastChild.textContent = hidden ? ' Show updated' : ' Hide updated'; });
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
  document.querySelectorAll('.fd-tabs[data-tabs]').forEach((tabs) => {
    const list = tabs.querySelector('.fd-tabs__list');
    const buttons = [...list.querySelectorAll('[role="tab"]:not(:disabled)')];
    const activate = (button, moveFocus = false) => {
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = tabs.querySelector(`#${item.dataset.tabTarget}`);
        if (panel) panel.hidden = !selected;
      });
      if (moveFocus) button.focus();
    };
    buttons.forEach((button) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', (event) => {
        const current = buttons.indexOf(button);
        const next = event.key === 'ArrowRight' ? (current + 1) % buttons.length : event.key === 'ArrowLeft' ? (current - 1 + buttons.length) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : -1;
        if (next >= 0) { event.preventDefault(); activate(buttons[next], true); }
      });
    });
    activate(buttons.find((button) => button.getAttribute('aria-selected') === 'true') || buttons[0]);
  });
  document.querySelectorAll('.fd-toggle-group').forEach((group) => {
    const buttons = [...group.querySelectorAll('button:not(:disabled)')];
    const multiple = group.hasAttribute('data-toggle-multiple');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (multiple) button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
        else buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      });
      if (!multiple && group.hasAttribute('data-toggle-group')) button.addEventListener('keydown', (event) => {
        const current = buttons.indexOf(button);
        const next = event.key === 'ArrowRight' ? (current + 1) % buttons.length : event.key === 'ArrowLeft' ? (current - 1 + buttons.length) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : -1;
        if (next < 0) return;
        event.preventDefault();
        buttons[next].focus();
        buttons[next].click();
      });
    });
  });
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
    copyText(`<svg class="fd-icon" aria-hidden="true">\n  <use href="#${name}"></use>\n</svg>`);
  }));
  bindDocTabs();
}

function router() {
  const route = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  document.body.classList.remove('nav-open');
  document.body.classList.toggle('docs-overview-route', !route.length || ['patterns', 'about'].includes(route[0]));
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
  updatePrimaryNavigation();
  window.scrollTo(0, 0);
}

search.addEventListener('input', () => renderNavigation(search.value));
function focusDocumentationSearch() {
  const catalogSearch = document.querySelector('[data-catalog-search]');
  if (catalogSearch) { catalogSearch.focus(); return; }
  if (document.body.classList.contains('docs-overview-route')) {
    location.hash = '#/components';
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector('[data-catalog-search]')?.focus()));
    return;
  }
  search.focus();
}
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); focusDocumentationSearch(); }
  if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; renderNavigation(); search.blur(); }
  if (event.key === 'Escape' && document.activeElement?.matches('[data-catalog-search]')) { document.activeElement.value = ''; document.activeElement.dispatchEvent(new Event('input', { bubbles: true })); document.activeElement.blur(); }
});
document.querySelector('.docs-search-trigger').addEventListener('click', focusDocumentationSearch);
document.querySelector('.nav-toggle').addEventListener('click', (event) => {
  const open = document.body.classList.toggle('nav-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
const themeToggle = document.querySelector('.theme-toggle');
const themeRoot = document.documentElement;
if (themeRoot.classList.contains('fd-theme-dark')) {
  themeToggle.querySelector('use').setAttribute('href', '#sun');
  themeToggle.setAttribute('aria-label', 'Use light colour scheme');
}
themeToggle.addEventListener('click', (event) => {
  themeRoot.classList.add('theme-switching');
  const dark = themeRoot.classList.toggle('fd-theme-dark');
  event.currentTarget.querySelector('use').setAttribute('href', `#${dark ? 'sun' : 'moon'}`);
  event.currentTarget.setAttribute('aria-label', dark ? 'Use light colour scheme' : 'Use dark colour scheme');
  try { localStorage.setItem('foundry-theme', dark ? 'dark' : 'light'); } catch (_) {}
  requestAnimationFrame(() => requestAnimationFrame(() => themeRoot.classList.remove('theme-switching')));
});
window.addEventListener('hashchange', router);
renderNavigation();
router();
