/**
 * Generates the PWA icon set from an inline SVG mark.
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

const BG = '#37281E'; // brand secondary (deep brown)
const FG = '#EFE9E1'; // warm cream

/** The chapel-spire mark, drawn as vector paths so it rasterizes identically everywhere. */
const mark = (scale = 1) => {
    // Everything is authored around the 512 canvas centre, then scaled toward it.
    const sx = (x) => 256 + (x - 256) * scale;
    const sy = (y) => 256 + (y - 256) * scale;
    const sw = (w) => w * scale;
    const p = (x, y) => `${sx(x)},${sy(y)}`;
    return `
    <g fill="${FG}">
      <polygon points="${p(256, 84)} ${p(324, 250)} ${p(188, 250)}" />
      <rect x="${sx(226)}" y="${sy(250)}" width="${sw(60)}" height="${sw(180)}" />
      <rect x="${sx(250)}" y="${sy(44)}" width="${sw(12)}" height="${sw(48)}" />
      <rect x="${sx(233)}" y="${sy(60)}" width="${sw(46)}" height="${sw(12)}" />
    </g>
    <rect x="${sx(242)}" y="${sy(358)}" width="${sw(28)}" height="${sw(74)}" rx="${sw(14)}" fill="${BG}" />`;
};

const roundedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" ry="112" fill="${BG}" />
  ${mark(1)}
</svg>`;

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}" />
  ${mark(0.72)}
</svg>`;

const targets = [
    { file: 'src/app/icon.png', svg: roundedSvg, size: 512 },
    { file: 'src/app/apple-icon.png', svg: roundedSvg, size: 180, flatten: true },
    { file: 'public/icons/icon-192.png', svg: roundedSvg, size: 192 },
    { file: 'public/icons/icon-512.png', svg: roundedSvg, size: 512 },
    { file: 'public/icons/maskable-192.png', svg: maskableSvg, size: 192 },
    { file: 'public/icons/maskable-512.png', svg: maskableSvg, size: 512 }
];

for (const { file, svg, size, flatten } of targets) {
    const abs = join(root, file);
    await mkdir(dirname(abs), { recursive: true });
    let pipeline = sharp(Buffer.from(svg)).resize(size, size);
    if (flatten) pipeline = pipeline.flatten({ background: BG });
    await writeFile(abs, await pipeline.png().toBuffer());
    console.log('wrote', file);
}
