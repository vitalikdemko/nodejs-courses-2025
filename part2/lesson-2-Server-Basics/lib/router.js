import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import { readdir, stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDir = path.join(__dirname, '../routes');

export const router = async(req, res) => {
  try {
    const [pathStr] = req.url.split('?');
    const segments = pathStr.split('/').filter(s => s.length > 0);

    console.log('segments: ', segments);
    console.log('pathStr: ', pathStr);

    if (segments.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
      return;
    }

    let currentDir = routesDir;
    req.params = {}; 

    for (const segment of segments) {
      let entries;
      try {
        entries = await readdir(currentDir, { withFileTypes: true });
      } catch (error) {
        console.error(error);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
      }

      const staticMatch = entries.find(e => e.isDirectory() && e.name === segment);
      if (staticMatch) {
        currentDir = path.join(currentDir, staticMatch.name);
        continue;
      }

      const dynamicMatch = entries.find(e => e.isDirectory() && e.name.startsWith('[') && e.name.endsWith(']'));
      console.log('dynamicMatch: ', dynamicMatch);
      if (dynamicMatch) {
        const paramName = dynamicMatch.name.slice(1, -1);
        req.params[paramName] = segment;
        console.log('req.params: ', req.params);
        currentDir = path.join(currentDir, dynamicMatch.name);
        continue;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
      return;
    }

    const routeFilePath = path.join(currentDir, 'route.js');
    console.log('routeFilePath: ', routeFilePath);

    try {
      await stat(routeFilePath);
    } catch (error) {
        console.error(`Route file not found: ${routeFilePath}`, error);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }

    const routeModule = await import(pathToFileURL(routeFilePath).href);

    const method = req.method.toUpperCase();
    const handler = routeModule[method];
    if (typeof handler !== 'function') {
      const allowedMethods = Object.keys(routeModule).filter(key =>['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].includes(key) && typeof routeModule[key] === 'function');
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.setHeader('Allow', allowedMethods.join(', '));
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    await handler(req, res);
  } catch (err) {
    console.error('Internal server error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
};
