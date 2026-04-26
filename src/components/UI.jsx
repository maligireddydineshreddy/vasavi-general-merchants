// ============================================================
// Spinner.jsx — Loading spinner
// ============================================================
import React from 'react';

export const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sz = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' }[size];
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className={`${sz} border-4 border-green-200 border-t-brand-green rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );
};

// ── Error Banner ──────────────────────────────────────────────────────────
export const ErrorBanner = ({ message = 'Something went wrong. Please try again.' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">⚠️</div>
    <p className="text-gray-700 font-medium">{message}</p>
    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
      Retry
    </button>
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────
export const Badge = ({ children, color = 'green' }) => {
  const colors = {
    green:  'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    red:    'bg-red-100 text-red-700',
    blue:   'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray:   'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.green}`}>
      {children}
    </span>
  );
};

// ── Status Badge ──────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    Delivered:  { color: 'green',  label: '✓ Delivered' },
    Shipped:    { color: 'blue',   label: '🚚 Shipped' },
    Pending:    { color: 'yellow', label: '⏳ Pending' },
    Processing: { color: 'orange', label: '⚙️ Processing' },
    Cancelled:  { color: 'red',    label: '✕ Cancelled' },
  };
  const s = map[status] || { color: 'gray', label: status };
  return <Badge color={s.color}>{s.label}</Badge>;
};

// ── Empty State ───────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📦', title = 'Nothing here', subtitle = '', action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
    <div className="text-5xl">{icon}</div>
    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    {subtitle && <p className="text-gray-500 text-sm max-w-xs">{subtitle}</p>}
    {action}
  </div>
);
