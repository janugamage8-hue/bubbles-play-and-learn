// Test script to verify all endpoints
import http from 'http';

const urls = [
  '/',
  '/css/main.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/products.js',
  '/js/cart.js',
  '/js/box-builder.js',
  '/js/quiz.js',
  '/js/survey.js',
  '/js/app.js',
  '/assets/logo.jpg',
  '/assets/home/kids-wooden-blocks.jpg',
  '/assets/home/kids-magnetic-tiles.jpg',
  '/assets/products/extracted_1_2/img_1.jpg',
  '/assets/products/extracted_2_3/img_1.jpg',
  '/assets/products/extracted_5_plus/img_1.jpg'
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          type: res.headers['content-type'],
          length: data.length
        });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing Bubbles local server endpoints...\n');
  let passed = 0;
  for (const url of urls) {
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`✅ [200 OK] ${res.path.padEnd(24)} (${res.type}, ${res.length} bytes)`);
      passed++;
    } else {
      console.error(`❌ [FAILED] ${res.path}`, res);
    }
  }
  console.log(`\nResults: ${passed}/${urls.length} endpoints verified successfully!`);
}

run();
