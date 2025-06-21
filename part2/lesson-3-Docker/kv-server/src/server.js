const http = require('http');
const { URL } = require('url');

const REDIS_URL = process.env.REDIS_URL || 'http://localhost:4000';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/kv') {
    const key = url.searchParams.get('key');
    
      fetch(`${REDIS_URL}/get?key=${key}`).then(r => r.text()).then(body => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(body);
      });

  } else if (req.method === 'POST' && url.pathname === '/kv') {

    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      fetch(`${REDIS_URL}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      })
        .then(r => r.text())
        .then(data => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        });
    });

  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, '0.0.0.0', () => console.log('KV-server on 3000'));

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
