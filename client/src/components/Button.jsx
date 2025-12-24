import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  type = 'button',
  disabled = false
}) => {
  const baseStyles = "px-6 py-3 rounded-md font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border-2 border-blue-700 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "text-slate-600 hover:text-blue-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

