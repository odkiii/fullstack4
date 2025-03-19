import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import TodoList from './components/TodoList';
import ThemeToggle from './components/ThemeToggle';
import './style.css'; 



const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.style.backgroundColor = isDarkTheme ? '#fff' : '#333';
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
      document.body.style.backgroundColor = savedTheme === 'dark' ? '#333' : '#fff';
      document.body.style.color = savedTheme === 'dark' ? '#fff' : '#000';
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <Provider store={store}>
      <div>
        <ThemeToggle toggleTheme={toggleTheme} />
        <TodoList />
      </div>
    </Provider>
  );
};

export default App;