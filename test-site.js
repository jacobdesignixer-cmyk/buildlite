const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// 1. Check local files
const filesToCheck = [
  'index.html',
  'css/main.css',
  'css/hero.css',
  'css/sections.css',
  'css/responsive.css',
  'js/hero-canvas.js',
  'js/navigation.js',
  'js/packages.js',
  'js/gallery.js',
  'js/modal.js',
  'js/app.js',
  'public/images/buildlite-logo.svg',
  'public/images/buildlite-logo-white.svg',
  'public/images/cabin-hero.jpg',
  'public/images/cabin-exploded.png',
  'public/images/footer-house.jpg',
  'public/images/interior-living.jpg',
  'public/images/garden-adu.jpg',
  'public/images/studio-office.jpg',
  'public/scroll-frames/frame_000000.jpg',
  'public/scroll-frames/frame_000119.jpg'
];

let allLocalFilesPresent = true;
for (const f of filesToCheck) {
  const full = path.join(__dirname, f);
  if (!fs.existsSync(full)) {
    console.error(`Missing file: ${f}`);
    allLocalFilesPresent = false;
  }
}
console.log('Local files check passed:', allLocalFilesPresent);

// Check total frames in public/scroll-frames
const framesDir = path.join(__dirname, 'public/scroll-frames');
const frameFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
console.log(`Total scroll frames in public/scroll-frames: ${frameFiles.length}`);

// 2. HTTP Request check
function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, length: data.length });
      });
    }).on('error', err => reject(err));
  });
}

async function runTests() {
  try {
    const urlsToTest = [
      '/',
      '/index.html',
      '/css/main.css',
      '/css/hero.css',
      '/css/sections.css',
      '/css/responsive.css',
      '/js/hero-canvas.js',
      '/public/images/buildlite-logo.svg',
      '/public/images/cabin-hero.jpg',
      '/public/images/footer-house.jpg',
      '/public/images/interior-living.jpg',
      '/public/images/garden-adu.jpg',
      '/public/images/studio-office.jpg',
      '/public/scroll-frames/frame_000000.jpg',
      '/public/scroll-frames/frame_000119.jpg'
    ];

    console.log('Testing HTTP endpoints on live server...');
    for (const u of urlsToTest) {
      const res = await fetchUrl(u);
      console.log(`[HTTP ${res.status}] ${u} (${res.headers['content-type']})`);
      if (res.status !== 200) {
        throw new Error(`Failed endpoint: ${u} (Status: ${res.status})`);
      }
    }
    console.log('ALL HTTP ENDPOINT CHECKS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err.message);
    process.exit(1);
  }
}

runTests();
