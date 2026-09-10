import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';

const name = 'Anirudh Yadav';
const line1 = 'I build the paved road';
const line2 = 'other engineers ship on.';
const meta = 'Platform engineer · Mercari · Tokyo';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbfaf7"/>
  <circle cx="84" cy="96" r="9" fill="#0f6b4f"/>
  <text x="108" y="104" font-family="IBM Plex Mono, ui-monospace, monospace" font-size="26" fill="#6b6b66">${meta}</text>
  <text x="80" y="300" font-family="IBM Plex Sans, system-ui, sans-serif" font-size="72" font-weight="500" letter-spacing="-1.5" fill="#1a1a1a">${line1}</text>
  <text x="80" y="386" font-family="IBM Plex Sans, system-ui, sans-serif" font-size="72" font-weight="500" letter-spacing="-1.5" fill="#1a1a1a">${line2}</text>
  <text x="80" y="540" font-family="IBM Plex Mono, ui-monospace, monospace" font-size="28" fill="#6b6b66">${name}</text>
  <line x1="80" y1="470" x2="1120" y2="470" stroke="#e6e4de" stroke-width="2"/>
</svg>`;

const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
writeFileSync('public/og.png', png);
console.log(`wrote public/og.png (${png.length} bytes)`);
