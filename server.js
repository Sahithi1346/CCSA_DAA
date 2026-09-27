const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  let targetFile = reqUrl === '/' ? 'landing.html' : reqUrl.slice(1);
  if (reqUrl === '/dashboard') targetFile = 'index.html';
  if (reqUrl === '/landing') targetFile = 'landing.html';

  let filePath = path.join(__dirname, targetFile);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'landing.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/ (Landing Page: landing.html, Dashboard: index.html)`);
});
