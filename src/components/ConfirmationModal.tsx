import React, { useRef, useEffect } from 'react';
import { GiftItem } from '../types';

interface ConfirmationModalProps {
  item: GiftItem | null;
  onClose: () => void;
  onConfirm: (item: GiftItem) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ item, onClose, onConfirm }) => {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (item) {
      const t = setTimeout(() => confirmBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative z-50 w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 ease-out translate-y-0"
      >
        <h3 id="confirm-title" className="text-lg font-semibold text-neutral-900">Подтвердите удаление</h3>
        <p className="mt-2 text-sm text-neutral-600">Вы уверены, что хотите удалить подарок <span className="font-semibold">"{item.name}"</span>{item.category ? ` — ${item.category}` : ''}?</p>
        <p className="mt-2 text-xs text-neutral-400 break-words">ID: <span className="font-mono text-xs text-neutral-600">{item.id}</span></p>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition"
          >
            Отмена
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => onConfirm(item)}
            className="rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
