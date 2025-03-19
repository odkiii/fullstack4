export const ADD_TODO = 'ADD_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const FETCH_TODOS = 'FETCH_TODOS';

export const addTodo = (todo) => ({
  type: ADD_TODO,
  payload: todo,
});

export const editTodo = (todo) => ({
  type: EDIT_TODO,
  payload: todo,
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: id,
});

// Асинхронное действие для загрузки задач из локального хранилища
export const fetchTodos = () => (dispatch) => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  dispatch({ type: FETCH_TODOS, payload: todos });
};