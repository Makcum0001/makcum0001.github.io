import React from 'react';
import photo from '../assets/photo.jpg';
import { migrateMissingCreatedAt } from '../api/gifts';

interface HeaderProps {
  fancy: boolean;
  loading: boolean;
  hasItems: boolean;
  onToggleFancy: () => void;
  onSpawn25: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ fancy, loading, hasItems, onToggleFancy, onSpawn25, children }) => {
  return (
    <header className="relative w-full max-w-3xl pt-6 flex flex-col items-center text-center">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={onToggleFancy}
          className="rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium hover:bg-accent/20 transition"
        >
          {fancy ? 'Classic' : 'Fancy'} UI
        </button>
        {loading && hasItems && (
          <div className="flex items-center gap-2 rounded-full bg-neutral-50/60 px-3 py-1 text-xs text-neutral-600">Синхронизация…</div>
        )}
        {(typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
          <button
            type="button"
            onClick={() => migrateMissingCreatedAt().catch(err => console.error(err))}
            className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium hover:bg-red-200 transition"
            title="Fix missing createdAt in Firestore (dev only)"
          >
            Fix timestamps
          </button>
        )}
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="font-extrabold tracking-tight text-accent text-2xl sm:text-3xl md:text-4xl leading-snug">
          Wishlist
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative" aria-label="Фото">
            <div className="h-48 w-48 sm:h-56 sm:w-56 rounded-full border-4 border-accent flex items-center justify-center overflow-hidden bg-white shadow-md select-none">
              <img src={photo} alt="Фото" className="h-full w-full object-cover pointer-events-none" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-accent drop-shadow-sm select-none">
            Happy Birthday
          </h1>
          <div
            onClick={onSpawn25}
            className="text-5xl sm:text-6xl font-black text-neutral-900/90 select-none cursor-pointer transition-transform active:scale-90 hover:scale-105"
            title="Fire 25 fireworks"
          >
            25
          </div>
        </div>
      </div>
      {children}
    </header>
  );
};

export default Header;
