import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

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
  res.send(todos);
});

app.post('/todos', (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
  }

  const todo = {
    title,
    id: uuidv4(),
    completed: false,
    userId: USER_ID,
  };

  todos.push(todo);

  res.statusCode = 201;

  res.send(todo);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const newTodos = todos.filter(todo => todo.id !== id);

  if (todos.length === newTodos.length) {
    res.sendStatus(404);
    return;
  }

  todos = newTodos;

  res.send(todos);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  Object.assign(todo, { title, completed });

  res.send(todo);
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
    res.send(todos)
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
     
    res.send(todos)
    res.sendStatus(204);
    return;
  }

  res.sendStatus(422);
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
});

app.listen(3005, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
