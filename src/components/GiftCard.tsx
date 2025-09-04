import React, { useState } from 'react';
import { GiftItem } from '../types';

interface Props {
  item: GiftItem;
  onToggle: (id: string, bookedBy?: string) => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const GiftCard: React.FC<Props> = ({ item, onToggle, onDelete, isDeleting }) => {
  // Separate state for the booking process UI
  const [isBooking, setIsBooking] = useState(false);
  // State for the name input field
  const [name, setName] = useState(item.bookedBy ?? '');

  const handleConfirmBooking = () => {
  // Pass empty string instead of undefined so booking without a name still sets isBooked = true
  onToggle(item.id, name.trim() || '');
    setIsBooking(false);
  };

  const handleCancelBooking = () => {
    setIsBooking(false);
    // Reset name if the user cancels
    setName(item.bookedBy ?? '');
  };

  const handleStartBooking = () => {
    console.debug('[GiftCard] start booking click', { id: item.id, isBooked: item.isBooked });
    setIsBooking(true);
    // Fallback: if for some reason state not reflected next tick, force re-render
    requestAnimationFrame(() => {
      if (!isBooking) {
        // Note: isBooking here is stale closure value (pre-set), this is only for log visibility
        console.debug('[GiftCard] post RAF (stale isBooking value logged)');
      }
    });
  };

  const handleUnbook = () => {
  // Passing undefined signals unbooking (handled in update logic)
  onToggle(item.id, undefined);
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
        onClick={onDelete}
        disabled={isDeleting}
        className={`absolute top-3 right-3 rounded-full p-2.5 flex items-center justify-center transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
          item.isBooked
            ? 'bg-white/20 text-white hover:bg-white/30 focus:ring-white focus:ring-offset-booked'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-accent'
        }`}
        aria-label="Удалить"
      >
        {/* ... (delete icon SVG remains the same) */}
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
        {item.isBooked ? (
          // Already booked: show who booked it and an unbook button
          <>
            {item.bookedBy && <p className="text-sm text-center">Забронировал: <span className="font-semibold">{item.bookedBy}</span></p>}
            <button
              onClick={handleUnbook}
              className="rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-white text-booked hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-booked"
            >
              Снять бронь
            </button>
          </>
        ) : isBooking ? (
          // In the process of booking
          <>
            <input
              type="text"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-accent focus:outline-none"
              placeholder="Ваше имя (необязательно)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="rounded-md px-4 py-2 text-sm font-semibold bg-accent text-white hover:bg-booked shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Подтвердить
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="rounded-md px-4 py-2 text-sm font-semibold bg-neutral-200 text-neutral-800 hover:bg-neutral-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
              >
                Отмена
              </button>
            </div>
          </>
        ) : (
          // Not booked, show the initial book button
          <button
            type="button"
            onClick={handleStartBooking}
            className="rounded-md px-4 py-2 text-sm font-semibold bg-accent text-white hover:bg-booked shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Забронировать
          </button>
        )}
      </div>
      {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
          <div className="mt-1 text-xs text-neutral-400 break-words select-text">ID: {item.id}</div>
        )}
    </div>
  );
};

export default GiftCard;
