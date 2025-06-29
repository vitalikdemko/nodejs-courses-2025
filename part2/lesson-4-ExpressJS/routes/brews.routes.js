import express from 'express';
import { makeInvoker } from 'awilix-express';

const router = express.Router();
const api = makeInvoker(c => c.brewsController);

router.get('/brews', api('getAll'));
router.get('/brews/:id', api('getById'));
router.post('/brews', api('create'));
router.put('/brews/:id', api('update'));
router.delete('/brews/:id', api('delete'));

export { router };