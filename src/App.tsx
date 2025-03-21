/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

import * as clientTodo from './api/client/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeStatus, setActiveStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, activeStatus),
    [todos, activeStatus],
  );
  const notCompletedTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );
  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );
  const isToogleAll = completedTodos.length === todos.length;

  const onAddTodo = (title: string) => {
    setTempTodo({
      id: '0',
      title,
      userId: clientTodo.USER_ID,
      completed: false,
      createdAt: '',
    });

    return clientTodo
      .createTodo(title)
      .then(todo =>
        setTodos(currentTodos => {
          // console.log(todo);
          return [...currentTodos, todo];
        }),
      )
      .catch(err => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        throw err;
      })
      .finally(() => setTempTodo(null));
  };

  const onUpdateTodo = (todoToUpdate: Todo) => {
    setLoadingTodoIds(prevTodos => [...prevTodos, todoToUpdate.id]);

    return clientTodo
      .updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(err => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(prevTodos =>
          prevTodos.filter(id => todoToUpdate.id !== id),
        );
      });
  };

  const onDeleteTodo = (todoId: string) => {
    setLoadingTodoIds(prevTodos => [...prevTodos, todoId]);

    clientTodo
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() =>
        setLoadingTodoIds(prevTodos => prevTodos.filter(id => todoId !== id)),
      );
  };

  const onDeleteAllCompleted = () => {
    clientTodo.deleteAll(todos.filter(todo => todo.completed)).then(setTodos);
  };

  const onToggleAll = () => {
    if (todos.every(todo => todo.completed)) {
      clientTodo
        .updateAll(todos.map(todo => ({ ...todo, completed: false })))
        .then(setTodos);
    } else {
      clientTodo
        .updateAll(todos.map(todo => ({ ...todo, completed: true })))
        .then(setTodos);
    }
  };

  useEffect(() => {
    clientTodo
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      });
  }, []);

  if (!clientTodo.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          error={errorMessage}
          isToogleAll={todos.length === 0 ? null : isToogleAll}
          isInputDisablet={!!tempTodo}
          isDeletedTodos={todos.length}
          onAddTodo={onAddTodo}
          onToggleAll={onToggleAll}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          tempTodo={tempTodo}
          filteredTodos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />

        {!!todos.length && (
          <TodoFooter
            activeStatus={activeStatus}
            completedTodos={completedTodos.length}
            notCompletedTodos={notCompletedTodos.length}
            onDeleteAllCompleted={onDeleteAllCompleted}
            setActiveStatus={setActiveStatus}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
