import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';


const app = express();

app.use(cors());
app.use(express.json());

const USER_ID = 2135;
const todos = [
  {
    id: '2',
    title: 'dd',
    compleated: true,
    userId: USER_ID,
  },
];


app.get('/todos', (req, res) => {
  res.send(todos);
});


app.get('/todos/:id',  (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    res.sendStatus(404);
    return;
  }

  res.send(todo);
});

app.post('/todos', (req, res) => {
  const { title } = req.body;
  
  if(!title){
    res.sendStatus(422)
  }

  const todo = {
    title,
    id: uuidv4(),
    compleated: false,
    userId: USER_ID,
  };

  todos.push(todo);

  res.statusCode = 201;

  res.send(todo);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const newTodos = todos.filter(todo => todo.id !== id);

  res.send(newTodos);
});

app.put('/todos/:id', (req, res) => {
  res.send('Hello');
});

app.patch('/todos/:id', (req, res) => {
  res.send('Hello');
});

app.listen(3005, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
