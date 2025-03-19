import React, { useState } from 'react';

const ThemeToggle = ({ toggleTheme }) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated(!isRotated);
    toggleTheme();
  };

  return (
    <button 
      style={{ 
        display: 'flex', 
        margin: 'auto',
        marginBottom: '50px',
        marginTop: '50px',
        
        flexDirection: 'column', 
        justifyContent: 'center', 
        transition: 'transform 0.6s', 
        transform: isRotated ? 'rotate(360deg)' : 'rotate(0deg)' 
      }} 
      className="Theme" 
      onClick={handleClick} 
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;