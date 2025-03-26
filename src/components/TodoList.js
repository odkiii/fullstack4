import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, editTodo, deleteTodo } from '../redux/actions';
import TodoItem from './TodoItem';
import Calendar from 'react-calendar'; // Добавляем календарь
import 'react-calendar/dist/Calendar.css'; // Стили календаря
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './auth';


const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [status, setStatus] = useState('new'); // Состояние для статуса задачи
  const [dueDate, setDueDate] = useState(new Date()); // Срок выполнения
  const [reminder, setReminder] = useState(false); // Напоминание
  const [reminderTime, setReminderTime] = useState(''); // Время напоминания
  const [calendarDate, setCalendarDate] = useState(new Date()); // Выбранная дата в календаре
  const [user, setUser] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false); // Показать/скрыть календарь

  // // Эффект для проверки состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        dispatch(fetchTodos(user.uid)); // Загружаем задачи при входе
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Эффект для проверки напоминаний
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (todo.reminder && new Date(todo.reminderTime) <= now && !todo.reminded) {
          alert(`Напоминание: "${todo.text}"`);
          // Обновляем задачу как "напоминавшуюся"
          dispatch(editTodo({ ...todo, reminded: true }));
        }
      });
    };
    
    const interval = setInterval(checkReminders, 60000); // Проверка каждую минуту
    return () => clearInterval(interval);
  }, [todos, dispatch]);

  // Функция для добавления новой задачи
  const handleAdd = async () => {
    if (!user) return;
    
    const todo = { 
      // БЕЗ ПОЛЯ ID!
      text: newTodo,
      status: status,
      dueDate: dueDate.toISOString(),
      reminder: reminder,
      reminderTime: reminder ? new Date(reminderTime).toISOString() : null,
      reminded: false,
      userId: user.uid
    };
    
    try {
      await dispatch(addTodo(todo)); // Firestore сам создаст ID
      setNewTodo('');
      setStatus('new');
      setDueDate(new Date());
      setReminder(false);
      setReminderTime('');
    } catch (error) {
      console.error('Ошибка добавления:', error);
    }
  };
  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };
  
  // Функция для обновления задачи
  const handleUpdate = () => {
    if (!editingTodo?.id) { // Проверка наличия ID
      console.error('No document ID to update');
      return;
    }

    const updatedTodo = { 
      ...editingTodo, 
      text: newTodo,
      status: status,
      dueDate: dueDate.toISOString(),
      reminder: reminder,
      reminderTime: reminder ? new Date(reminderTime).toISOString() : null
    };
    
    
    dispatch(editTodo(updatedTodo));
    setNewTodo('');
    setEditingTodo(null);
    setStatus('new');
    setDueDate(new Date());
    setReminder(false);
    setReminderTime('');
  };


  // Функция для начала редактирования задачи
  const handleEdit = (todo) => {
    console.log('Editing todo:', todo); 

    setEditingTodo(todo);
    setNewTodo(todo.text);
    setStatus(todo.status);
    setDueDate(new Date(todo.dueDate));
    setReminder(todo.reminder);
    setReminderTime(todo.reminderTime ? new Date(todo.reminderTime).toISOString().slice(0, 16) : '');
  };

  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string') { // Важно: проверяем тип
      console.error('Invalid document ID:', id);
      return;
    }
  
    try {
      await dispatch(deleteTodo(id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };


  // Функция для фильтрации задач по выбранной дате в календаре
  const filteredTodos = todos.filter(todo => {
    if (!showCalendar) return true;
    const todoDate = new Date(todo.dueDate).toDateString();
    const selectedDate = calendarDate.toDateString();
    return todoDate === selectedDate;
  });

  return (
    <div className="todo-list">
      {!user ? (
        // Показываем только форму авторизации, если пользователь не вошел
        <Auth setUser={setUser} />
      ) : (
        // Показываем весь интерфейс Todo, если пользователь авторизован
        <>
          <div className="auth-section">
            <p>Вы вошли как: {user.email}</p>
            <button className="sign-out" onClick={handleSignOut}>Выйти</button>
          </div>
  
          <h2>To-Do List</h2>
          
          {/* Форма добавления/редактирования задачи */}
          <div>
            <input 
              className="todo-form"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Добавить новую задачу"
            />
          {/* Выбор статуса задачи */}
          <select className='task-status' value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="new">Новая</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершена</option>
          </select>
          
          {/* Выбор срока выполнения */}
          <input
            className='due-date'
            type="datetime-local"
            value={dueDate.toISOString().slice(0, 16)}
            onChange={(e) => setDueDate(new Date(e.target.value))}
          />
          
          {/* Напоминание */}
          <label className='set-reminder'>
          <input 
            className='dontsee'
            type="checkbox"
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
            id="reminder-checkbox"
          />
          <label htmlFor="reminder-checkbox">Установить напоминание</label>
          {reminder && (
            <input
              className='reminder-time'
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </label>
          
          
          
          <button onClick={editingTodo ? handleUpdate : handleAdd}>
            {editingTodo ? 'Обновить задачу' : 'Добавить задачу'}
          </button>
        </div>
        
        {/* Переключатель для календаря */}
        <button onClick={() => setShowCalendar(!showCalendar)}>
          {showCalendar ? 'Скрыть календарь' : 'Показать календарь'}
        </button>
        
        {/* Календарь */}
        {showCalendar && (
          <div className="calendar-section">
            <Calendar 
              onChange={setCalendarDate} 
              value={calendarDate} 
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const hasTasks = todos.some(todo => 
                    new Date(todo.dueDate).toDateString() === date.toDateString()
                  );
                  return hasTasks ? <div className="task-marker" /> : null;
                }
              }}
            />
          </div>
        )}
      
      {/* Список задач */}
      <div className="todos-container">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>Нет задач для отображения</p>
          )}
        </div>
      </>
    )}
  </div>
);
}
export default TodoList; 