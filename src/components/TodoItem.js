import React from 'react';

const TodoItem = ({ todo, onEdit, onDelete }) => {
  // Функция для получения стилей в зависимости от статуса
  const getStatusStyle = () => {
    switch(todo.status) {
      case 'new':
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'in-progress':
        return { backgroundColor: '#fff8e1', color: '#ff8f00' };
      case 'completed':
        return { backgroundColor: '#e8f5e9', color: '#388e3c' };
      default:
        return {};
    }
  };

  return (
    <div className="todo-item">
      <span className="todo-text">{todo.text}</span>
      <div className="todo-actions">
        <span 
          className="todo-status" 
          style={getStatusStyle()}
        >
          {todo.status === 'new' && 'Новая'}
          {todo.status === 'in-progress' && 'В процессе'}
          {todo.status === 'completed' && 'Завершена'}
        </span>
        <button className='editButton' onClick={() => onEdit(todo)}>Edit</button>
        <button className='deleteButton' onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TodoItem;