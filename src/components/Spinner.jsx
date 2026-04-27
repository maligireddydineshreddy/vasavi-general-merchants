import React from 'react';
export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-800 rounded-full animate-spin" />
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
}
