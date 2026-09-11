import { FilterSettings } from '../types';

export interface RenderOptions {
  sourceImage: HTMLImageElement;
  targetCanvas: HTMLCanvasElement;
  filters: FilterSettings;
  maxWidth?: number;
  maxHeight?: number;
}

export function render80sPhoto(options: RenderOptions) {
  const { sourceImage, targetCanvas, filters, maxWidth = 1200, maxHeight = 1600 } = options;

  let width = sourceImage.naturalWidth || sourceImage.width;
  let height = sourceImage.naturalHeight || sourceImage.height;

  // Scale down if too huge to keep canvas responsive
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Adjust for polaroid frame if chosen
  const isPolaroid = filters.frame === 'polaroid';
  const polaroidBorder = isPolaroid ? Math.round(width * 0.05) : 0;
  const polaroidBottom = isPolaroid ? Math.round(width * 0.18) : 0;

  targetCanvas.width = width + polaroidBorder * 2;
  targetCanvas.height = height + polaroidBorder + polaroidBottom;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  // Polaroid background
  if (isPolaroid) {
    ctx.fillStyle = '#f8f5ee'; // Aged cream polaroid paper
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    // Subtle drop shadow around photo inner edge
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(polaroidBorder - 2, polaroidBorder - 2, width + 4, height + 4);
  }

  const offsetX = polaroidBorder;
  const offsetY = polaroidBorder;

  // Offscreen canvas for base photo and pixel processing
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const oCtx = offscreen.getContext('2d');
  if (!oCtx) return;

  // 1. Draw base image
  oCtx.drawImage(sourceImage, 0, 0, width, height);

  // 2. Apply Bloom / Soft Glamour Glow if requested
  if (filters.bloomGlow > 0) {
    oCtx.save();
    oCtx.filter = `blur(${Math.round(filters.bloomGlow * 0.15)}px) brightness(1.2)`;
    oCtx.globalAlpha = (filters.bloomGlow / 100) * 0.45;
    oCtx.drawImage(sourceImage, 0, 0, width, height);
    oCtx.restore();
  }

  // 3. Pixel Manipulation: Chromatic Aberration, Kodachrome Warmth, Contrast & Saturation
  try {
    const imgData = oCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Chromatic Aberration offset in pixels
    const shift = Math.round(filters.chromaticAberration);
    const copyData = new Uint8ClampedArray(data);

    const warmthFactor = filters.warmth / 100; // -0.5 to 0.5
    const contrast = filters.contrast / 100; // 0.8 to 1.5
    const saturation = filters.saturation / 100; // 0.8 to 1.8

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;

        // Chromatic Aberration RGB split
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (shift > 0) {
          const rx = Math.min(width - 1, x + shift);
          const bx = Math.max(0, x - shift);
          r = copyData[(y * width + rx) * 4];
          b = copyData[(y * width + bx) * 4 + 2];
        }

        // Saturation & Contrast
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        // Contrast adjustment
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;

        // 80s Kodachrome warm tint
        if (warmthFactor > 0) {
          r += warmthFactor * 32;
          g += warmthFactor * 12;
          b -= warmthFactor * 18;
        } else if (warmthFactor < 0) {
          // Cool synthwave tint
          r += warmthFactor * 20;
          b -= warmthFactor * 30;
        }

        // Film Grain
        if (filters.filmGrain > 0) {
          const noise = (Math.random() - 0.5) * (filters.filmGrain * 0.9);
          r += noise;
          g += noise;
          b += noise;
        }

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
    }

    oCtx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.error("Canvas pixel processing error:", e);
  }

  // Draw offscreen back to target canvas
  ctx.drawImage(offscreen, offsetX, offsetY, width, height);

  // 4. CRT Scanlines
  if (filters.scanlines) {
    ctx.save();
    const lineAlpha = (filters.scanlineIntensity / 100) * 0.35;
    ctx.fillStyle = `rgba(0, 0, 0, ${lineAlpha})`;
    for (let y = offsetY; y < offsetY + height; y += 4) {
      ctx.fillRect(offsetX, y, width, 2);
    }
    ctx.restore();
  }

  // 5. VHS Distortion Band
  if (filters.vhsDistortion) {
    ctx.save();
    const glitchY = offsetY + Math.floor(height * 0.75);
    const glitchH = Math.max(14, Math.floor(height * 0.05));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fillRect(offsetX, glitchY, width, glitchH);

    // Static noise in glitch band
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    for (let gx = offsetX; gx < offsetX + width; gx += 3) {
      if (Math.random() > 0.4) {
        ctx.fillRect(gx, glitchY + (Math.random() * glitchH), Math.random() * 8, 2);
      }
    }
    ctx.restore();
  }

  // 6. Laser Grid Overlay Frame
  if (filters.frame === 'laser_grid') {
    ctx.save();
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.lineWidth = 2;
    const gridSpacing = 36;
    for (let x = offsetX; x <= offsetX + width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, offsetY + height * 0.6);
      ctx.lineTo(offsetX + width / 2 + (x - (offsetX + width / 2)) * 1.5, offsetY + height);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    for (let y = offsetY + height * 0.6; y <= offsetY + height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 7. Neon Border Frame
  if (filters.frame === 'neon_border') {
    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 15;
    ctx.strokeRect(offsetX + 8, offsetY + 8, width - 16, height - 16);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.strokeRect(offsetX + 14, offsetY + 14, width - 28, height - 28);
    ctx.restore();
  }

  // 8. VHS Screen Frame
  if (filters.frame === 'vhs_screen') {
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 10;
    ctx.strokeRect(offsetX, offsetY, width, height);

    // Glowing CRT rounded corners
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 30, 0, Math.PI / 2);
    ctx.arc(offsetX + width, offsetY, 30, Math.PI / 2, Math.PI);
    ctx.arc(offsetX + width, offsetY + height, 30, Math.PI, Math.PI * 1.5);
    ctx.arc(offsetX, offsetY + height, 30, Math.PI * 1.5, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 9. VCR On-Screen Display (OSD) Timestamp
  if (filters.vcrTimestamp && filters.timestampText) {
    ctx.save();
    const fontSize = Math.max(18, Math.round(width * 0.038));
    ctx.font = `bold ${fontSize}px "VT323", monospace`;
    ctx.fillStyle = '#f59e0b'; // Retro 80s amber/orange LED font
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 8;

    const posX = offsetX + width * 0.05;
    const posY = offsetY + height * 0.92;
    ctx.fillText(filters.timestampText, posX, posY);

    // Subtle Play indicator at top right
    ctx.fillStyle = '#22c55e'; // Green VCR playback indicator
    ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
    ctx.font = `bold ${Math.round(fontSize * 0.8)}px "VT323", monospace`;
    ctx.fillText("PLAY ►  SP", offsetX + width * 0.05, offsetY + height * 0.08);
    ctx.restore();
  }

  // 10. Polaroid Handwritten Caption
  if (isPolaroid) {
    ctx.save();
    const captionSize = Math.max(20, Math.round(width * 0.045));
    ctx.font = `600 ${captionSize}px "Righteous", cursive, sans-serif`;
    ctx.fillStyle = '#1e293b'; // Sharpie marker ink
    ctx.textAlign = 'center';
    const captionText = filters.sticker || "Summer '85";
    ctx.fillText(captionText, targetCanvas.width / 2, offsetY + height + polaroidBottom * 0.65);
    ctx.restore();
  } else if (filters.sticker) {
    // Floating 80s Sticker Badge
    ctx.save();
    ctx.translate(offsetX + width * 0.8, offsetY + height * 0.12);
    ctx.rotate(0.14); // Slight 8-degree slant
    const badgeText = filters.sticker;
    ctx.font = `900 ${Math.max(14, Math.round(width * 0.032))}px "Righteous", cursive, sans-serif`;
    const textMetrics = ctx.measureText(badgeText);
    const padX = 14;
    const padY = 8;
    const badgeW = textMetrics.width + padX * 2;
    const badgeH = Math.max(24, Math.round(width * 0.045)) + padY;

    // Gradient background
    const grad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    grad.addColorStop(0, '#f43f5e');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 8);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    ctx.fillText(badgeText, 0, 1);
    ctx.restore();
  }
}
