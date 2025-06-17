import { createServer } from 'http';
import { router } from './lib/router.js';

const PORT = process.env.PORT || 3000;

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Server created. Port ${PORT}`);
});