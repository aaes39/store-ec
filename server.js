const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Clean URLs & Rewrites matching _redirects
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  } else if (reqPath === '/admin' || reqPath === '/admin/') {
    reqPath = '/admin/index.html';
  } else if (reqPath === '/admin/login') {
    reqPath = '/admin/login.html';
  } else if (reqPath === '/admin/products') {
    reqPath = '/admin/products.html';
  } else if (reqPath === '/admin/orders') {
    reqPath = '/admin/orders.html';
  } else if (reqPath === '/admin/settings-store') {
    reqPath = '/admin/settings-store.html';
  } else if (reqPath === '/admin/settings-adsense') {
    reqPath = '/admin/settings-adsense.html';
  } else if (reqPath === '/admin/settings-seo') {
    reqPath = '/admin/settings-seo.html';
  } else if (reqPath === '/privacy') {
    reqPath = '/pages/privacy.html';
  } else if (reqPath === '/terms') {
    reqPath = '/pages/terms.html';
  } else if (reqPath === '/cookies') {
    reqPath = '/pages/cookies.html';
  } else if (reqPath === '/about') {
    reqPath = '/pages/about.html';
  } else if (reqPath === '/contact') {
    reqPath = '/pages/contact.html';
  }

  let filePath = path.join(PUBLIC_DIR, reqPath);

  // If path is a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If file doesn't have an extension and doesn't exist, try appending .html
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>404 - الصفحة غير موجودة</h1><p><a href="/">العودة إلى المتجر</a></p>');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Store local server running at http://localhost:${PORT}`);
});

