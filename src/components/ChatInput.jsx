import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';

export default function ChatInput({ placeholder = 'Tell Sparky here!', onSubmit, className = '' }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-full border-2 border-[#5BC8C8] flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#5BC8C8] hover:text-white transition-colors text-[#5BC8C8]">
        <Plus size={18} />
      </div>
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#5BC8C8] pr-10"
        />
        {value && (
          <button onClick={handleSubmit} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5BC8C8]">
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
}