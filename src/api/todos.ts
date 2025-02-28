/* eslint-disable prettier/prettier */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import axios from 'axios';

export const USER_ID = 2135;
axios.defaults.baseURL = 'http://localhost:3005';

export const getTodos = () => {
  return axios.get('/todos').then(res => res.data);
};

export const createTodos = (title: string) => {
  return axios.post<Todo>(`/todos`, { title }).then(res => res.data);
};

export const deleteTodo = (id: number) => {
  return axios.delete(`/todos/${id}`).then(res => res.data);
};

export const updateTodo = ({ id, title, completed, userId }: Todo) => {
  return axios
    .put<Todo>(`/todos/${id}`, { title, completed, userId })
    .then(res => res.data);
};

export const deleteAll = (items: Todo[]) => {
  return axios
    .patch<Todo[]>('/todos?action=delete', { ids: items.map(item => item.id) })
    .then(res => res.data);
};

export const updateAll = (items: Todo[]) => {
  return axios
    .patch<Todo[]>('/todos?action=update', { items })
    .then(res => res.data);
};

export const getTodo = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};
