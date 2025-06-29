import { createContainer, asClass } from 'awilix';
import { BrewsService } from './services/brews.service.js';
import { brewsController } from './controllers/brews.controller.js';

export const container = createContainer();

container.register({
  brewsService: asClass(BrewsService).singleton(),
  brewsController: asClass(brewsController).singleton()
});
