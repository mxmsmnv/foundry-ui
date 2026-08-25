import fs from 'node:fs';

const spritePath = new URL('../src/icons.svg', import.meta.url);
const outputPath = new URL('../src/icon-sprite.js', import.meta.url);
const sprite = fs.readFileSync(spritePath, 'utf8')
  .replace('style="display:none"', 'id="fd-icon-sprite" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"');

const output = `window.FOUNDRY_ICON_SPRITE = ${JSON.stringify(sprite)};\ndocument.body.insertAdjacentHTML('afterbegin', window.FOUNDRY_ICON_SPRITE);\n`;
fs.writeFileSync(outputPath, output);
console.log(`Built inline icon sprite: ${outputPath.pathname}`);
