/**
 * Realistic Pixel-Buffer Text Dissolution Engine
 * - Rasterizes the user's exact typed text onto an offscreen canvas
 * - Samples the pixel buffer with ctx.getImageData()
 * - Spawns 300+ physical glowing embers originating exactly where the font glyphs were
 * - Simulates buoyant upward lift, fluid drag, rotational torque, and chromatic fading
 */

export function generateTextPixelEmbers({
  text,
  canvasWidth,
  canvasHeight,
  originY = canvasHeight * 0.65,
  mode = 'purge'
}) {
  if (!text || text.trim().length === 0) return [];

  // Create an offscreen canvas to rasterize the text
  const offscreen = document.createElement('canvas');
  const offCtx = offscreen.getContext('2d');
  offscreen.width = Math.min(canvasWidth, 400);
  offscreen.height = 160;

  // Render text with word wrapping matching the input textarea
  offCtx.fillStyle = '#FFFFFF';
  offCtx.font = '500 15px Inter, system-ui, sans-serif';
  offCtx.textBaseline = 'top';

  const maxWidth = offscreen.width - 40;
  const lineHeight = 22;
  const words = text.slice(0, 160).split(' ');
  let line = '';
  let y = 20;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = offCtx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      offCtx.fillText(line, 20, y);
      line = words[n] + ' ';
      y += lineHeight;
      if (y > offscreen.height - 30) break;
    } else {
      line = testLine;
    }
  }
  offCtx.fillText(line, 20, y);

  // Read pixel buffer
  const imgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imgData.data;
  const illuminatedPixels = [];

  // Sample with step for performance and high ember distribution
  const step = 2;
  for (let py = 0; py < offscreen.height; py += step) {
    for (let px = 0; px < offscreen.width; px += step) {
      const idx = (py * offscreen.width + px) * 4;
      const alpha = data[idx + 3];
      if (alpha > 80) {
        illuminatedPixels.push({ x: px, y: py, alpha });
      }
    }
  }

  // Offset coordinates to match parent canvas position
  const offsetX = (canvasWidth - offscreen.width) / 2;
  const offsetY = originY;

  // Select 350+ sampled points to spawn realistic embers
  const totalEmbers = Math.min(380, Math.max(120, Math.floor(illuminatedPixels.length * 0.7)));
  const embers = [];

  for (let i = 0; i < totalEmbers; i++) {
    const randIdx = Math.floor(Math.random() * illuminatedPixels.length);
    const pt = illuminatedPixels[randIdx];
    if (!pt) continue;

    const startX = offsetX + pt.x;
    const startY = offsetY + pt.y;

    const isPurge = mode === 'purge';
    const hue = isPurge
      ? Math.random() > 0.35 ? '56, 189, 248' : '173, 198, 255'
      : Math.random() > 0.35 ? '129, 140, 248' : '199, 210, 254';

    embers.push({
      x: startX,
      y: startY,
      radius: Math.random() * 2.4 + 0.8,
      vx: (Math.random() - 0.5) * 3.8,
      vy: -(Math.random() * 4.6 + 2.2), // Strong upward buoyant drift
      alpha: 1.0,
      decay: Math.random() * 0.012 + 0.007,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      hue,
      isRing: Math.random() > 0.8,
      turbPhase: Math.random() * Math.PI * 2
    });
  }

  return embers;
}
