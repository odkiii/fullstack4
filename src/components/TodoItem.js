import React from 'react';

const TodoItem = ({ todo, onEdit, onDelete }) => {
  return (
    <div>
      <span>{todo.text}</span>
      <button className='editButton' onClick={() => onEdit(todo)}>Edit</button>
      <button className='deleteButton' onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;