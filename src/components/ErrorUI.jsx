import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
export default function ErrorUI({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <FiAlertCircle className="text-red-500 text-3xl" />
      </div>
      <p className="text-gray-700 font-semibold text-lg">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline flex items-center gap-2">
          <FiRefreshCw />Try Again
        </button>
      )}
    </div>
  );
}
