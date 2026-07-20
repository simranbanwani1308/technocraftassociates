import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

createServer(async (req, res) => {
  const safePath = decodeURIComponent(req.url.split('?')[0]).replace(/\.\./g, '');
  const filePath = join(__dirname, safePath === '/' ? 'index.html' : safePath);
  const type = mime[extname(filePath)] ?? 'application/octet-stream';
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
