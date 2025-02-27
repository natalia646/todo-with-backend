import express from 'express';
import pg from 'pg';

const { Client } = pg;
const app = express();

app.use(express.json());

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'weroni4ka',
  database: 'postgres',
});

await client.connect();
const result = await client.query(`SELECT * FROM todos`);

console.log(result.rows);

export const getTodos = async () => {
  const result = await client.query(`SELECT * FROM todos`);

  return result.rows
};
