const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'temp_icon.png');

const sizes = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192
};

async function processIcons() {
  console.log('Starting icon generation...');
  try {
    const image = sharp(inputFile);
    const metadata = await image.metadata();

    // The image is wide, so we crop to a square from the center
    const minSize = Math.min(metadata.width, metadata.height);
    console.log(`Original size: ${metadata.width}x${metadata.height}. Cropping to ${minSize}x${minSize}...`);

    for (const [density, size] of Object.entries(sizes)) {
      const outputPath = path.join(__dirname, `android/app/src/main/res/mipmap-${density}`);
      
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      // Generate square icon
      const resizedSquare = await image.clone()
        .resize(minSize, minSize, {
          fit: 'cover',
          position: 'centre' // Crop to center
        })
        .resize(size, size)
        .png()
        .toBuffer();

      fs.writeFileSync(path.join(outputPath, 'ic_launcher.png'), resizedSquare);
      
      // Generate round icon
      const roundMask = Buffer.from(`<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" /></svg>`);
      const roundIcon = await sharp(resizedSquare)
        .composite([{ input: roundMask, blend: 'dest-in' }])
        .png()
        .toBuffer();

      fs.writeFileSync(path.join(outputPath, 'ic_launcher_round.png'), roundIcon);
      console.log(`✅ Generated ${density} icons (${size}x${size})`);
    }
    console.log('SYSTEM UPDATE: App icons successfully integrated.');
  } catch (error) {
    console.error('SYSTEM ERROR: Failed to process icons.', error);
  }
}

processIcons();