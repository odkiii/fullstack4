import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, editTodo, deleteTodo } from '../redux/actions';
import TodoItem from './TodoItem';


const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAdd = () => {
    const todo = { id: Date.now(), text: newTodo };
    dispatch(addTodo(todo));
    localStorage.setItem('todos', JSON.stringify([...todos, todo]));
    setNewTodo('');
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
  };

  const handleUpdate = () => {
    const updatedTodo = { ...editingTodo, text: newTodo };
    dispatch(editTodo(updatedTodo));
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setNewTodo('');
    setEditingTodo(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={editingTodo ? handleUpdate : handleAdd }>
        {editingTodo ? 'Update Task' : 'Add Task'}
      </button>
      <div>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;