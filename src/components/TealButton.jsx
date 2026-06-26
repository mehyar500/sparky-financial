import React from 'react';

export default function TealButton({ children, onClick, disabled, className = '', variant = 'primary' }) {
  const base = 'w-full py-3.5 px-6 rounded-full font-semibold text-base transition-all duration-200 active:scale-95 focus:outline-none';
  const styles = {
    primary: 'bg-[#5BC8C8] hover:bg-[#4ab5b5] text-white shadow-md',
    secondary: 'bg-[#3a6b6b] hover:bg-[#2e5555] text-white shadow-md',
    outline: 'bg-transparent border-2 border-[#5BC8C8] text-[#5BC8C8] hover:bg-[#5BC8C8] hover:text-white',
    dark: 'bg-[#2c4a4a] hover:bg-[#1e3535] text-white shadow-md',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}