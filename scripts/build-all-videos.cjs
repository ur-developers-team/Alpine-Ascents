const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const HME = require('h264-mp4-encoder');

const VIDEO_LIST = [
  {
    id: 'hunza',
    title: 'Hunza Valley Expedition',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'skardu',
    title: 'Skardu Adventure',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'k2',
    title: 'K2 / Baltoro Region',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'naltar',
    title: 'Naltar Valley',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'fairy-meadows',
    title: 'Fairy Meadows',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'deosai',
    title: 'Deosai Plains',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'nanga-parbat',
    title: 'Nanga Parbat',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'everest',
    title: 'Everest / Himalayan Adventure',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'alpine-camping',
    title: 'Alpine Camping',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80'
    ]
  },
  {
    id: 'trekking',
    title: 'Mountain Trekking Experience',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80'
    ]
  }
];

const CACHE_DIR = path.join(__dirname, 'cache');
const OUT_DIR = path.join(__dirname, '..', 'public', 'videos');

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function downloadImage(url, filename) {
  const cachePath = path.join(CACHE_DIR, filename);
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(cachePath, buf);
  return buf;
}

// Fast scale image to target dimensions (width x height)
function scaleImage(raw, targetW, targetH) {
  const scaled = new Uint8Array(targetW * targetH * 4);
  const xRatio = raw.width / targetW;
  const yRatio = raw.height / targetH;

  for (let y = 0; y < targetH; y++) {
    const srcY = Math.floor(y * yRatio);
    for (let x = 0; x < targetW; x++) {
      const srcX = Math.floor(x * xRatio);
      const srcIdx = (srcY * raw.width + srcX) * 4;
      const dstIdx = (y * targetW + x) * 4;

      scaled[dstIdx] = raw.data[srcIdx];
      scaled[dstIdx + 1] = raw.data[srcIdx + 1];
      scaled[dstIdx + 2] = raw.data[srcIdx + 2];
      scaled[dstIdx + 3] = 255;
    }
  }
  return scaled;
}

async function renderVideo(def) {
  console.log(`[RENDER] Generating ${def.id}.mp4 (${def.title})...`);
  const targetW = 640;
  const targetH = 360;
  const fps = 20;
  const secondsPerImage = 2.5;
  const transitionSeconds = 0.8;
  const totalSeconds = def.images.length * secondsPerImage;
  const totalFrames = Math.round(totalSeconds * fps);

  // Pre-load and pre-scale all images
  const scaledImages = [];
  for (let i = 0; i < def.images.length; i++) {
    const filename = `${def.id}_img${i}.jpg`;
    const buf = await downloadImage(def.images[i], filename);
    const raw = jpeg.decode(buf, { useTArray: true });
    scaledImages.push(scaleImage(raw, targetW, targetH));

    // Save first image as poster
    if (i === 0) {
      fs.writeFileSync(path.join(OUT_DIR, `${def.id}-poster.jpg`), buf);
    }
  }

  const encoder = await HME.createH264MP4Encoder();
  encoder.width = targetW;
  encoder.height = targetH;
  encoder.frameRate = fps;
  encoder.quantizationParameter = 26; // Crisp web video quality
  encoder.initialize();

  const frameBuffer = new Uint8Array(targetW * targetH * 4);
  const pixelCount = targetW * targetH;

  for (let f = 0; f < totalFrames; f++) {
    const time = f / fps;
    const imgIndex = Math.min(Math.floor(time / secondsPerImage), scaledImages.length - 1);
    const nextImgIndex = Math.min(imgIndex + 1, scaledImages.length - 1);
    
    const timeInSegment = time - imgIndex * secondsPerImage;
    const isTransition = timeInSegment >= (secondsPerImage - transitionSeconds) && imgIndex < scaledImages.length - 1;
    const blendFactor = isTransition
      ? (timeInSegment - (secondsPerImage - transitionSeconds)) / transitionSeconds
      : 0;

    const img1 = scaledImages[imgIndex];
    const img2 = scaledImages[nextImgIndex];

    if (blendFactor <= 0) {
      // Direct copy
      frameBuffer.set(img1);
    } else {
      // Linear blend
      const invBlend = 1 - blendFactor;
      for (let i = 0; i < pixelCount; i++) {
        const idx = i * 4;
        frameBuffer[idx] = Math.round(img1[idx] * invBlend + img2[idx] * blendFactor);
        frameBuffer[idx + 1] = Math.round(img1[idx + 1] * invBlend + img2[idx + 1] * blendFactor);
        frameBuffer[idx + 2] = Math.round(img1[idx + 2] * invBlend + img2[idx + 2] * blendFactor);
        frameBuffer[idx + 3] = 255;
      }
    }

    encoder.addFrameRgba(frameBuffer);
  }

  encoder.finalize();
  const output = encoder.FS.readFile(encoder.outputFilename);
  const outPath = path.join(OUT_DIR, `${def.id}.mp4`);
  fs.writeFileSync(outPath, Buffer.from(output));
  encoder.delete();

  console.log(`[DONE] ${def.id}.mp4 created: ${(output.length / 1024).toFixed(1)} KB, duration: ${totalSeconds}s`);
}

async function runAll() {
  console.log(`Building ${VIDEO_LIST.length} real MP4 videos into public/videos/...`);
  for (const def of VIDEO_LIST) {
    try {
      await renderVideo(def);
    } catch (err) {
      console.error(`Failed rendering ${def.id}:`, err);
    }
  }
  console.log('All 10 videos generated successfully!');
}

runAll();
