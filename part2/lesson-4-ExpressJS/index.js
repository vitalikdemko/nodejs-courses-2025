import http from 'node:http';
import { createApp } from './app.js';

const app = createApp();
const server = http.createServer(app);

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`API started on http://localhost:${PORT}`)
);

function shutDown() {
  server.close(() => {
    process.exit(0);
  });
}
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);