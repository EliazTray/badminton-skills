import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const OUT_DIR = join(process.cwd(), 'public', 'icons');
const BG = [30, 105, 87, 255];
const FG = [250, 248, 241, 255];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(size, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const rows = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    rows[rowStart] = 0;
    rgba.copy(rows, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function createIcon(size, scale = 1) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    rgba[i * 4] = BG[0];
    rgba[i * 4 + 1] = BG[1];
    rgba[i * 4 + 2] = BG[2];
    rgba[i * 4 + 3] = 255;
  }

  const cx = size / 2;
  const cy = size / 2;
  const s = size * scale;
  const corkR = s * 0.125;
  const corkY = cy + s * 0.17;
  const lineWidth = Math.max(2, s * 0.045);

  const featherPoints = [
    [cx - s * 0.24, cy - s * 0.27],
    [cx - s * 0.10, cy - s * 0.31],
    [cx + s * 0.10, cy - s * 0.31],
    [cx + s * 0.24, cy - s * 0.27],
  ];

  const setPixel = (x, y) => {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || py < 0 || px >= size || py >= size) return;
    const i = (py * size + px) * 4;
    rgba[i] = FG[0];
    rgba[i + 1] = FG[1];
    rgba[i + 2] = FG[2];
    rgba[i + 3] = 255;
  };

  for (const [x, y] of featherPoints) {
    const dx = x - cx;
    const dy = y - (corkY - corkR * 0.6);
    const length = Math.hypot(dx, dy);
    for (let step = 0; step <= length; step += 0.5) {
      const t = step / length;
      const lx = cx + dx * t;
      const ly = corkY - corkR * 0.6 + dy * t;
      for (let ox = -lineWidth / 2; ox <= lineWidth / 2; ox += 0.5) {
        for (let oy = -lineWidth / 2; oy <= lineWidth / 2; oy += 0.5) {
          if (ox * ox + oy * oy <= (lineWidth * lineWidth) / 4) setPixel(lx + ox, ly + oy);
        }
      }
    }
  }

  for (let y = -corkR - 1; y <= corkR + 1; y += 0.5) {
    for (let x = -corkR - 1; x <= corkR + 1; x += 0.5) {
      if (x * x + y * y <= corkR * corkR) setPixel(cx + x, corkY + y);
    }
  }

  return png(size, rgba);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'icon-192.png'), createIcon(192));
writeFileSync(join(OUT_DIR, 'icon-512.png'), createIcon(512));
writeFileSync(join(OUT_DIR, 'icon-maskable-512.png'), createIcon(512, 0.72));
writeFileSync(join(OUT_DIR, 'apple-touch-icon.png'), createIcon(180));
console.log(`Generated icons in ${OUT_DIR}`);
