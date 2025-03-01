import * as services from '../services/todo.service.js';

export const get = async (req, res) => {
  const todos = await services.getAll();
  res.send(todos);
};

export const getOne = async (req, res) => {
  const { id } = req.params;
  const todo = await services.getById(id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
};

export const create = (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
  }

  

  res.send(services.create(title));

  res.statusCode = 201;
};

export const update = (req, res) => {
  const { id } = req.params;
  const { title, completed, userId } = req.body;

  const todo = services.getById(id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  const updatedTodo = services.update({ id, title, completed, userId });

  res.send(updatedTodo);
};

export const remove = (req, res) => {
  const { id } = req.params;

  if (!services.getById(id)) {
    res.sendStatus(404);
    return;
  }

  const newTodos = services.remove(id);

  res.send(newTodos);
};

export const removeMany = (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  const newTodos = services.removeMany(ids);

  res.send(newTodos);
  res.sendStatus(204);

  return;
};

export const updateMany = (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  const updatedTodos = services.updateMany(items);

  res.send(updatedTodos);
  res.sendStatus(204);

  return;
};
