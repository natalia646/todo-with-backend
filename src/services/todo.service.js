// import express from 'express';
// import pg from 'pg';

import { v4 as uuidv4 } from 'uuid';

const USER_ID = 2135;
let todos = [
  {
    id: '2',
    title: 'dd',
    completed: true,
    userId: USER_ID,
  },
];

export const getAll = () => {
  return todos;
};

export const getById = id => {
  const todo = todos.find(todo => todo.id === id) || null;
  return todo
};

export const create = title => {
  const todo = {
    title,
    id: uuidv4(),
    completed: false,
    userId: USER_ID,
  };

  todos.push(todo);

  return todo;
};

export const update = ({ id, title, completed }) => {
  const todo = getById(id);

  Object.assign(todo, { title, completed });

  return todo;
};

export const remove = (id) => {
  const newTodos = todos.filter(todo => todo.id !== id);

  todos = newTodos;

  return todos;
};

// const { Client } = pg;
// const app = express();

// app.use(express.json());

// const client = new Client({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'weroni4ka',
//   database: 'postgres',
// });

// await client.connect();
// const result = await client.query(`SELECT * FROM todos`);

// console.log(result.rows);

// export const getTodos = async () => {
//   const result = await client.query(`SELECT * FROM todos`);

//   return result.rows;
// };
