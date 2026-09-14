const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const HME = require('h264-mp4-encoder');

// High-altitude mountain images from Unsplash (clean landscape shots)
const VIDEO_DEFINITIONS = [
  {
    id: 'hunza',
    title: 'Hunza Valley Expedition',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80'
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

// Sample pixel with bilinear interpolation
function sampleImage(raw, normX, normY) {
  const srcX = Math.max(0, Math.min(raw.width - 1, normX * (raw.width - 1)));
  const srcY = Math.max(0, Math.min(raw.height - 1, normY * (raw.height - 1)));
  
  const x0 = Math.floor(srcX);
  const y0 = Math.floor(srcY);
  const idx00 = (y0 * raw.width + x0) * 4;
  
  return [raw.data[idx00], raw.data[idx00 + 1], raw.data[idx00 + 2], 255];
}

async function renderVideo(def) {
  console.log(`Starting render for: ${def.id}...`);
  const decodedImages = [];
  
  for (let i = 0; i < def.images.length; i++) {
    const buf = await downloadImage(def.images[i], `${def.id}_img${i}.jpg`);
    const raw = jpeg.decode(buf, { useTArray: true });
    decodedImages.push(raw);
    
    // Save first image as poster
    if (i === 0) {
      fs.writeFileSync(path.join(OUT_DIR, `${def.id}-poster.jpg`), buf);
    }
  }

  const width = 640;
  const height = 360;
  const fps = 24;
  const secondsPerImage = 3;
  const transitionSeconds = 1;
  
  const totalSeconds = def.images.length * secondsPerImage;
  const totalFrames = totalSeconds * fps;

  const encoder = await HME.createH264MP4Encoder();
  encoder.width = width;
  encoder.height = height;
  encoder.frameRate = fps;
  encoder.quantizationParameter = 23; // High visual quality
  encoder.initialize();

  const frameBuffer = new Uint8Array(width * height * 4);

  for (let f = 0; f < totalFrames; f++) {
    const time = f / fps;
    const imgIndex = Math.min(Math.floor(time / secondsPerImage), decodedImages.length - 1);
    const nextImgIndex = Math.min(imgIndex + 1, decodedImages.length - 1);
    
    const timeInSegment = time - imgIndex * secondsPerImage;
    const progressInSegment = timeInSegment / secondsPerImage; // 0 to 1
    
    // Ken burns zoom for current image
    const zoom1 = 1.0 + 0.12 * progressInSegment;
    // Ken burns zoom for next image
    const zoom2 = 1.0 + 0.12 * (progressInSegment);

    const isTransition = timeInSegment >= (secondsPerImage - transitionSeconds) && imgIndex < decodedImages.length - 1;
    const blendFactor = isTransition
      ? (timeInSegment - (secondsPerImage - transitionSeconds)) / transitionSeconds
      : 0;

    const img1 = decodedImages[imgIndex];
    const img2 = decodedImages[nextImgIndex];

    for (let y = 0; y < height; y++) {
      const ny = (y / height - 0.5);
      for (let x = 0; x < width; x++) {
        const nx = (x / width - 0.5);
        
        // Sample from img1
        const s1x = 0.5 + nx / zoom1;
        const s1y = 0.5 + ny / zoom1;
        const [r1, g1, b1] = sampleImage(img1, s1x, s1y);

        let r = r1, g = g1, b = b1;

        if (blendFactor > 0) {
          const s2x = 0.5 + nx / zoom2;
          const s2y = 0.5 + ny / zoom2;
          const [r2, g2, b2] = sampleImage(img2, s2x, s2y);
          r = Math.round(r1 * (1 - blendFactor) + r2 * blendFactor);
          g = Math.round(g1 * (1 - blendFactor) + g2 * blendFactor);
          b = Math.round(b1 * (1 - blendFactor) + b2 * blendFactor);
        }

        const outIdx = (y * width + x) * 4;
        frameBuffer[outIdx] = r;
        frameBuffer[outIdx + 1] = g;
        frameBuffer[outIdx + 2] = b;
        frameBuffer[outIdx + 3] = 255;
      }
    }

    encoder.addFrameRgba(frameBuffer);
  }

  encoder.finalize();
  const output = encoder.FS.readFile(encoder.outputFilename);
  const outPath = path.join(OUT_DIR, `${def.id}.mp4`);
  fs.writeFileSync(outPath, Buffer.from(output));
  encoder.delete();
  console.log(`Rendered ${outPath} (${output.length} bytes, ${totalSeconds}s)`);
}

renderVideo(VIDEO_DEFINITIONS[0]).catch(err => {
  console.error('Error rendering test video:', err);
  process.exit(1);
});
