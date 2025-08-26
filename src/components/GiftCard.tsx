import React, { useState } from 'react';
import { GiftItem } from '../types';

interface Props {
  item: GiftItem;
  onToggle: (id: string, bookedBy?: string) => void;
  // onDelete is a parameterless callback; caller may close over the item to delete
  onDelete: () => void;
  isDeleting?: boolean;
}

const GiftCard: React.FC<Props> = ({ item, onToggle, onDelete, isDeleting }) => {
  const [name, setName] = useState(item.bookedBy ?? '');
  const handleToggle = () => {
    if (!item.isBooked) {
      onToggle(item.id, name.trim() || undefined);
    } else {
      onToggle(item.id, undefined);
    }
  };

  return (
    <div
      aria-busy={isDeleting || undefined}
      className={`group relative flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-transform duration-300 transform card-elevated ${
        item.isBooked ? 'bg-booked text-white border-booked' : 'bg-white border-neutral-200'
      } ${isDeleting ? 'opacity-80 pointer-events-none scale-98' : 'opacity-100 scale-100'}`}
    >
      {isDeleting && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl transition-opacity duration-300 ${item.isBooked ? 'bg-black/24' : 'bg-white/60'}`} role="status" aria-live="polite">
          <div className="flex flex-col items-center gap-2">
            <svg className={`${item.isBooked ? 'text-white' : 'text-neutral-800'} w-9 h-9 animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className={`${item.isBooked ? 'text-white/90' : 'text-neutral-800 text-opacity-90'} text-xs`}>Удаление…</span>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => { console.debug('delete button clicked', { id: item.id, name: item.name }); onDelete(); }}
        disabled={isDeleting}
        className={`absolute top-3 right-3 rounded-full p-2.5 flex items-center justify-center transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
          item.isBooked
            ? 'bg-white/20 text-white hover:bg-white/30 focus:ring-white focus:ring-offset-booked'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-accent'
        }`}
        aria-label="Удалить"
      >
        {isDeleting ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className="w-5 h-5"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <h3 className="text-lg font-semibold leading-tight break-words pr-10">{item.name}</h3>
        {item.description && (
          <p className="mt-1 text-sm opacity-80 whitespace-pre-wrap break-words">
            {item.description}
          </p>
        )}
        <p className="mt-2 inline-block rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent group-hover:bg-accent/15 transition">
          {item.category}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {item.isBooked && (
          <input
            type="text"
            className="w-full rounded-md border border-white/40 bg-white/20 px-3 py-2 text-sm placeholder-white/60 focus:border-white focus:outline-none"
            placeholder="Кто забронировал?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => onToggle(item.id, name.trim() || undefined)}
          />
        )}
        <button
          onClick={handleToggle}
          className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
            item.isBooked
              ? 'bg-white text-booked hover:bg-neutral-100 focus:ring-white focus:ring-offset-booked'
              : 'bg-accent text-white hover:bg-booked focus:ring-accent'
          }`}
        >
          {item.isBooked ? 'Снять бронь' : 'Забронировать'}
        </button>
      </div>
      {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
          <div className="mt-1 text-xs text-neutral-400 break-words select-text">ID: {item.id}</div>
        )}
    </div>
  );
};

export default GiftCard;
