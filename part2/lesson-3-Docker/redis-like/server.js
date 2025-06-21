const http = require('http');
const { URL } = require('url');

const store = new Map();

const server = http.createServer((req, res) => {

  const url = new URL(req.url, `http://${req.headers.host}`);

  console.log('url', url)

  if (req.method === 'GET' && url.pathname === '/get') {
    const key = url.searchParams.get('key');
    const value = store.get(key);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ value: value ?? null }));
  } 
  else if (req.method === 'POST' && url.pathname === '/set') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const { key, value } = JSON.parse(body);
        store.set(key, value);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4000, () => console.log('"Redis-like" listening on port 4000'));

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
