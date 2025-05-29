const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconPath = path.join(__dirname, 'public/icons/icon.svg');
const outputDir = path.join(__dirname, 'public/icons');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(iconPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    
    console.log(`Generated icon-${size}x${size}.png`);
  }
  
  // Also create favicon
  await sharp(iconPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'public/favicon.png'));
  
  console.log('Generated favicon.png');
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
