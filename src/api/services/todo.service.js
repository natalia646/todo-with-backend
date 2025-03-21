import 'dotenv/config';
import { sequelize } from '../db.js';
import { DataTypes, Op, where } from 'sequelize';

const { USER_ID } = process.env;

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.NUMBER,
      field: 'user_id',
      defaultValue: USER_ID,
    },
  },
  {
    tableName: 'todos',
    updatedAt: false,
  },
);

export const getAll = () => {
  return Todo.findAll();
};

export const getById = async id => {
  return await Todo.findByPk(id);
};

export const create = async title => {
  const newTodo = await Todo.create({ title });
  return newTodo;
};

export const update = async ({ id, title, completed }) => {
  const updated = await Todo.update(
    { title, completed },
    { where: { id }, returning: true, plain: true },
  );
  console.log(updated);
  return updated[1];
};

export const remove = id => {
  Todo.destroy({ where: { id } });
};

export const removeMany = async ids => {
  await Todo.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
};

export const updateMany = todos => {
  Todo.beforeCreate(todos, {
    updateOnDublicate: ['completed'],
  });
};
