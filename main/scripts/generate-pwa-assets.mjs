/**
 * Generates the PWA icon set from an inline SVG illustration.
 *
 * The mark is a flat-illustration scene: a temple with three spires and the
 * angel weather-vane against a mountain sky, an open member directory with a
 * portrait, a gold pen, and a clipboard with a checked task list plus a green
 * "done" badge — sitting above a blank gold banner (no lettering).
 *
 * Outputs:
 *   src/app/icon.png              favicon / tab icon (Next metadata convention)
 *   src/app/apple-icon.png        iOS home-screen icon (opaque, 180x180)
 *   public/icons/icon-192.png     manifest icon (purpose: any)
 *   public/icons/icon-512.png     manifest icon (purpose: any)
 *   public/icons/maskable-192.png manifest icon (purpose: maskable, padded safe zone)
 *   public/icons/maskable-512.png manifest icon (purpose: maskable, padded safe zone)
 *
 * Run with:  node scripts/generate-pwa-assets.mjs   (from the `main` directory)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SKY_FALLBACK = '#8FC0E6';

const defs = (radius) => `
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#5CA0DA" />
    <stop offset="0.55" stop-color="#9EC9EC" />
    <stop offset="1" stop-color="#CCE4F4" />
  </linearGradient>
  <linearGradient id="banner" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#CE9942" />
    <stop offset="1" stop-color="#9A6320" />
  </linearGradient>
  <linearGradient id="pen" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#F1D089" />
    <stop offset="0.5" stop-color="#D6A344" />
    <stop offset="1" stop-color="#A9781F" />
  </linearGradient>
  <clipPath id="frame"><rect x="0" y="0" width="512" height="512" rx="${radius}" ry="${radius}" /></clipPath>`;

/** Soft cloud built from a run of circles on a flat base. */
const cloud = (x, y, s) => `
  <g fill="#FFFFFF" fill-opacity="0.92">
    <ellipse cx="${x}" cy="${y}" rx="${34 * s}" ry="${20 * s}" />
    <ellipse cx="${x - 26 * s}" cy="${y + 6 * s}" rx="${22 * s}" ry="${15 * s}" />
    <ellipse cx="${x + 26 * s}" cy="${y + 6 * s}" rx="${24 * s}" ry="${16 * s}" />
  </g>`;

const SCENE = `
  <rect x="0" y="0" width="512" height="512" fill="url(#sky)" />

  ${cloud(96, 104, 1)}
  ${cloud(420, 78, 0.85)}
  ${cloud(300, 128, 0.6)}

  <!-- mountains -->
  <path d="M-40 268 L92 132 L232 268 Z" fill="#9FB6C9" />
  <path d="M92 132 L120 176 L64 176 Z" fill="#EEF4FA" />
  <path d="M292 268 L432 146 L572 268 Z" fill="#93ABC0" />
  <path d="M432 146 L462 190 L402 190 Z" fill="#E8F1F8" />

  <!-- ground -->
  <rect x="0" y="248" width="512" height="264" fill="#6E8F4F" />
  <path d="M0 276 Q256 240 512 276 L512 512 L0 512 Z" fill="#82AE5E" />

  <!-- temple -->
  <g>
    <rect x="118" y="212" width="276" height="96" fill="#E6E1D4" />
    <rect x="300" y="212" width="94" height="96" fill="#D4CDBC" />
    <rect x="118" y="206" width="276" height="12" fill="#F0ECE0" />

    <rect x="126" y="150" width="58" height="66" fill="#E9E4D6" />
    <path d="M122 152 L155 92 L188 152 Z" fill="#F0EBDE" />
    <rect x="328" y="150" width="58" height="66" fill="#E2DCCD" />
    <path d="M324 152 L357 92 L390 152 Z" fill="#EAE4D6" />

    <rect x="214" y="120" width="84" height="96" fill="#ECE7D9" />
    <rect x="226" y="94" width="60" height="28" fill="#F1ECDF" />
    <path d="M208 122 L256 44 L304 122 Z" fill="#F4F0E4" />

    <g fill="#AFC1C7">
      <rect x="140" y="168" width="9" height="44" rx="4" />
      <rect x="163" y="168" width="9" height="44" rx="4" />
      <rect x="340" y="168" width="9" height="44" rx="4" />
      <rect x="363" y="168" width="9" height="44" rx="4" />
      <rect x="228" y="150" width="9" height="60" rx="4" />
      <rect x="251" y="150" width="9" height="60" rx="4" />
      <rect x="274" y="150" width="9" height="60" rx="4" />
      <rect x="243" y="128" width="8" height="32" rx="4" />
      <rect x="261" y="128" width="8" height="32" rx="4" />
    </g>
    <g fill="#B9C8CE">
      <rect x="140" y="238" width="13" height="52" rx="6" />
      <rect x="180" y="238" width="13" height="52" rx="6" />
      <rect x="220" y="238" width="13" height="52" rx="6" />
      <rect x="260" y="238" width="13" height="52" rx="6" />
      <rect x="300" y="238" width="13" height="52" rx="6" />
      <rect x="340" y="238" width="13" height="52" rx="6" />
    </g>

    <g fill="#E4B23E">
      <circle cx="256" cy="44" r="5" />
      <rect x="252" y="20" width="8" height="20" rx="3" />
      <circle cx="256" cy="15" r="5" />
      <path d="M260 13 L281 5" stroke="#E4B23E" stroke-width="4" stroke-linecap="round" />
    </g>
  </g>

  <!-- gold banner (blank) -->
  <path d="M6 452 L34 430 L34 494 L6 508 Z" fill="#7E5620" />
  <path d="M506 452 L478 430 L478 494 L506 508 Z" fill="#7E5620" />
  <path d="M34 430 Q256 408 478 430 L478 492 Q256 514 34 492 Z" fill="url(#banner)" />
  <path d="M34 430 Q256 408 478 430 L478 441 Q256 419 34 441 Z" fill="#D9A85A" fill-opacity="0.7" />

  <!-- open directory -->
  <g>
    <path d="M40 300 L196 274 L352 300 L344 388 Q196 410 48 388 Z" fill="#6B4A2E" />
    <path d="M52 302 L196 279 L196 390 Q124 388 60 376 Z" fill="#F5EFE0" />
    <path d="M196 279 L340 302 L332 372 Q264 384 196 390 Z" fill="#EFE8D5" />
    <path d="M52 372 Q196 392 340 366 L338 378 Q196 402 54 382 Z" fill="#DDD3BB" />
    <line x1="196" y1="279" x2="196" y2="390" stroke="#C9BC9E" stroke-width="3" />

    <circle cx="104" cy="322" r="24" fill="#6E4A2C" />
    <circle cx="104" cy="314" r="8" fill="#F5EFE0" />
    <path d="M87 342 C87 327 121 327 121 342 Z" fill="#F5EFE0" />
    <g fill="#C7B996">
      <rect x="82" y="352" width="88" height="7" rx="3.5" transform="rotate(-5 82 352)" />
      <rect x="82" y="365" width="66" height="7" rx="3.5" transform="rotate(-5 82 365)" />
    </g>
    <g fill="#CDBD9C">
      <rect x="210" y="312" width="96" height="7" rx="3.5" transform="rotate(7 210 312)" />
      <rect x="210" y="328" width="96" height="7" rx="3.5" transform="rotate(7 210 328)" />
      <rect x="210" y="344" width="70" height="7" rx="3.5" transform="rotate(7 210 344)" />
    </g>
  </g>

  <!-- gold pen -->
  <g transform="rotate(-24 168 316)">
    <path d="M150 308 L168 300 L168 332 L150 324 Z" fill="#C9CDD3" />
    <path d="M158 312 L168 308 L168 324 L158 320 Z" fill="#8A5D20" />
    <rect x="168" y="300" width="132" height="32" rx="16" fill="url(#pen)" />
    <rect x="238" y="300" width="8" height="32" fill="#B9BEC4" fill-opacity="0.8" />
    <rect x="300" y="302" width="18" height="28" rx="7" fill="#8A5D20" />
  </g>

  <!-- clipboard -->
  <g transform="rotate(5 384 342)">
    <rect x="312" y="250" width="150" height="192" rx="14" fill="#7A5230" />
    <rect x="312" y="250" width="150" height="192" rx="14" fill="none" stroke="#5C3E26" stroke-width="4" />
    <rect x="328" y="270" width="118" height="156" rx="5" fill="#FCFBF7" />
    <rect x="366" y="240" width="44" height="26" rx="7" fill="#BCC1C7" />
    <rect x="376" y="233" width="24" height="13" rx="6" fill="#9AA0A6" />

    <path d="M338 302 l9 10 l17 -21" fill="none" stroke="#3FA845" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="372" y="298" width="62" height="9" rx="4.5" fill="#CBC6BA" />
    <path d="M338 344 l9 10 l17 -21" fill="none" stroke="#3FA845" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="372" y="340" width="62" height="9" rx="4.5" fill="#CBC6BA" />
    <rect x="336" y="382" width="20" height="20" rx="4" fill="none" stroke="#B7B2A5" stroke-width="4" />
    <rect x="372" y="386" width="50" height="9" rx="4.5" fill="#CBC6BA" />
  </g>

  <!-- done badge -->
  <circle cx="446" cy="410" r="42" fill="#FFFFFF" />
  <circle cx="446" cy="410" r="34" fill="#2E9E43" />
  <path d="M430 410 l10 11 l21 -27" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />`;

const buildSvg = (radius, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>${defs(radius)}</defs>
  <rect x="0" y="0" width="512" height="512" fill="${SKY_FALLBACK}" />
  <g clip-path="url(#frame)">
    <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
      ${SCENE}
    </g>
  </g>
</svg>`;

const framed = buildSvg(112, 1);
const maskable = buildSvg(0, 0.84);

const targets = [
    { file: 'src/app/icon.png', svg: framed, size: 512 },
    { file: 'src/app/apple-icon.png', svg: framed, size: 180, flatten: true },
    { file: 'public/icons/icon-192.png', svg: framed, size: 192 },
    { file: 'public/icons/icon-512.png', svg: framed, size: 512 },
    { file: 'public/icons/maskable-192.png', svg: maskable, size: 192 },
    { file: 'public/icons/maskable-512.png', svg: maskable, size: 512 }
];

for (const { file, svg, size, flatten } of targets) {
    const abs = join(root, file);
    await mkdir(dirname(abs), { recursive: true });
    let pipeline = sharp(Buffer.from(svg)).resize(size, size);
    if (flatten) pipeline = pipeline.flatten({ background: SKY_FALLBACK });
    await writeFile(abs, await pipeline.png().toBuffer());
    console.log('wrote', file);
}
