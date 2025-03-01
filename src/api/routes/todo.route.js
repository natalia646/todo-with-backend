import express from 'express';
import * as controller from '../controllers/todo.controller.js';

/** @type {import('express').Router} */
const router = express.Router();

router.get('/', controller.get);

router.get('/:id', controller.getOne);

router.post('/', controller.create);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);

router.patch('/', (req, res) => {
  const { action } = req.query;

  if (action === 'delete') {
    controller.removeMany(req, res);
    return;
  }

  if (action === 'update') {
    controller.updateMany(req, res);
    return;
  }

  res.sendStatus(422);
});

export { router }
