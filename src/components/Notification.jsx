import React from 'react';
import { useApp } from '../context/AppContext';
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

export default function Notification() {
  const { notification, showNotification } = useApp();
  if (!notification) return null;
  const icons = { success: <FiCheckCircle className="text-green-400 text-xl" />, info: <FiInfo className="text-blue-400 text-xl" />, error: <FiAlertCircle className="text-red-400 text-xl" /> };
  const borders = { success:'border-green-500', info:'border-blue-500', error:'border-red-500' };
  return (
    <div className={`fixed top-6 right-6 z-[9999] animate-slide-up bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-l-4 ${borders[notification.type||'success']} max-w-sm`}>
      {icons[notification.type||'success']}
      <p className="text-sm font-medium flex-1">{notification.msg}</p>
      <button onClick={() => showNotification(null)} className="text-gray-400 hover:text-white"><FiX /></button>
    </div>
  );
}
