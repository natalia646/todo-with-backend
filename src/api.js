import express from 'express';
import cors from 'cors';

import * as services from './services/todo.service.js';

const app = express();

app.use(cors());
app.use(express.json());

const USER_ID = 2135;

let todos = [
  {
    id: '2',
    title: 'dd',
    completed: true,
    userId: USER_ID,
  },
];

app.get('/todos', (req, res) => {
  res.send(services.getAll());
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = services.getById(id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
});

app.post('/todos', (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
  }

  res.send(services.create(title));

  res.statusCode = 201;
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!services.getById(id)) {
    res.sendStatus(404);
    return;
  }

  const newTodos = services.remove(id);

  res.send(newTodos);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = services.getById(id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  const updatedTodo = services.update({ id, title, completed });

  res.send(updatedTodo);
});

app.patch('/todos', (req, res) => {
  const { action } = req.query;
  const { ids, items } = req.body;

  if (action === 'delete') {
    if (!Array.isArray(ids)) {
      res.sendStatus(422);
      return;
    }

    const newTodos = todos.filter(todo => !ids.includes(todo.id));

    todos = newTodos;
    res.send(todos);
    res.sendStatus(204);

    return;
  }

  if (action === 'update') {
    if (!Array.isArray(items)) {
      res.sendStatus(422);
      return;
    }

    for (const { id, title, completed } of items) {
      const todo = todos.find(todo => todo.id === id);

      if (!todo) continue;
      Object.assign(todo, { title, completed });
    }

    res.send(todos);
    res.sendStatus(204);
    return;
  }

  res.sendStatus(422);
});

app.listen(3005, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
