import 'dotenv/config';
import { Sequelize } from 'sequelize';

const { DATABASE_PASSWORD, USER_ID, DATABASE_USER, DATABASE_NAME } =
  process.env;

export const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  },
);