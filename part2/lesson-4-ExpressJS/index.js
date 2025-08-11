import http from 'node:http';
import { createApp } from './app.js';
import { container } from './container.js';

const app = createApp();
const server = http.createServer(app);

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => {
  console.log(`API started on http://localhost:${PORT}`);
});

const GRACE_MS = 10_000;

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down...`);

  server.close(async () => {
    try {
      if (typeof container?.dispose === 'function') {
        await container.dispose();
      }
    } catch (err) {
      console.error('Error during container.dispose():', err);
    } finally {
      process.exit(0);
    }
  });

  setTimeout(async () => {
    try {
      if (typeof container?.dispose === 'function') {
        await container.dispose();
      }
    } finally {
      process.exit(1);
    }
  }, GRACE_MS).unref();
};

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));