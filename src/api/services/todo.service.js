import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const { Client } = pg;

const { DATABASE_PASSWORD, USER_ID, DATABASE_USER, DATABASE_NAME } =
  process.env;

const client = new Client({
  host: 'localhost',
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
});

await client.connect();

let todos = [
  {
    id: '2',
    title: 'dd',
    completed: true,
    userId: USER_ID,
  },
];

export const getAll = async () => {
  const result = await client.query('SELECT * FROM todos');

  return result.rows;
};

export const getById = async id => {
  const result = await client.query(`
    SELECT * FROM todos
    WHERE id = '${id}'
  `);

  return result.rows || null;
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

  if (todo) {
    Object.assign(todo, { title, completed });
  }

  return todo;
};

export const remove = id => {
  todos = todos.filter(todo => todo.id !== id);
};

export const removeMany = ids => {
  const newTodos = todos.filter(todo => !ids.includes(todo.id));

  todos = newTodos;

  return todos;
};

export const updateMany = items => {
  for (const { id, title, completed } of items) {
    const todo = getById(id);

    if (!todo) continue;

    Object.assign(todo, { title, completed });
  }

  return items;
};
