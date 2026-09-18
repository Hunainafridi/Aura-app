import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b, a = 255) {
  // Minimal PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte (0) before each row
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Draw celestial circle gradient
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.38;

      if (dist < radius) {
        const factor = 1 - dist / radius;
        rawData[pxOffset] = Math.min(255, Math.floor(r * (0.3 + 0.7 * factor)));
        rawData[pxOffset + 1] = Math.min(255, Math.floor(g * (0.4 + 0.6 * factor)));
        rawData[pxOffset + 2] = Math.min(255, Math.floor(b * (0.5 + 0.5 * factor)));
        rawData[pxOffset + 3] = a;
      } else {
        // Obsidian background
        rawData[pxOffset] = 9;
        rawData[pxOffset + 1] = 10;
        rawData[pxOffset + 2] = 15;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(calculateCrc(body), 0);

  return Buffer.concat([len, body, crc]);
}

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function calculateCrc(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const assetsDir = path.resolve('./assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. App Icon (1024x1024 cyan glow on obsidian)
const icon = createPng(512, 512, 76, 215, 246);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), icon);

// 2. Adaptive Icon
const adaptive = createPng(512, 512, 129, 140, 248);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptive);

// 3. Splash Screen
const splash = createPng(512, 512, 56, 189, 248);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splash);

console.log('✅ Generated Aura assets in mobile/assets/ (icon.png, adaptive-icon.png, splash.png)');
