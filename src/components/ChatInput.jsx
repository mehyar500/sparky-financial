import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ placeholder = 'Tell Sparky here!', onSubmit, className = '' }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#5BC8C8] pr-11"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          aria-label="Send"
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${value.trim() ? 'text-[#5BC8C8] hover:text-[#2c9a9a]' : 'text-gray-300 cursor-default'}`}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}