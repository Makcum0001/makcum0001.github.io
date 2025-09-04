import React from 'react';

const Loader: React.FC = () => (
  <div className="col-span-full flex items-center justify-center py-16">
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
      <svg className="w-16 h-16 text-accent" viewBox="0 0 50 50" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#ff0045" />
            <stop offset="100%" stopColor="#ff6b85" />
          </linearGradient>
        </defs>
        <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" className="opacity-20" fill="none" />
        <path d="M45 25a20 20 0 0 1-20 20" stroke="url(#g1)" strokeWidth="4" strokeLinecap="round" fill="none" className="origin-center animate-spin" style={{ transformOrigin: '25px 25px' }} />
      </svg>
      <div className="text-sm text-neutral-500">Загружаем подарки…</div>
    </div>
  </div>
);

export default Loader;
