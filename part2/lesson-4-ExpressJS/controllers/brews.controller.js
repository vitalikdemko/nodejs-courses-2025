import { BrewDTO } from '../dto/BrewDTO.js';
export class BrewsController {
  constructor({ brewsService }) {
    this.brewsService = brewsService;
  }

  validate(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
      const message = result.error.issues.map(i => i.message).join('; ');
      const error = new Error(message);
      error.status = 400;
      throw error;
    }
    return result.data;
  }

  getAll = (req, res) => {
    const { method, ratingMin } = req.query;
    const filters = {};
    if (method) filters.method = method;
    if (ratingMin) filters.ratingMin = Number(ratingMin);
    res.json(this.brewsService.getAll(filters));
  }

  getById = (req, res) => {
    const brew = this.brewsService.getById(req.params.id);
    if (!brew) return res.status(404).json({ error: 'Not found' });
    res.json(brew);
  }

  create = (req, res) => {
    const data = this.validate(BrewDTO, req.body);
    const newBrew = this.brewsService.create({
      ...data,
      brewedAt: data.brewedAt || new Date().toISOString()
    });
    res.status(201).json(newBrew);
  }

  update = (req, res) => {
    const data = this.validate(BrewDTO, req.body);
    const updated = this.brewsService.update(req.params.id, data);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }

  delete = (req, res) => {
    const success = this.brewsService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  }
}

export const brewsController = BrewsController;