
import { routeCommand } from './router/cliRouter.js';

const args = process.argv.slice(2);
routeCommand(args);
