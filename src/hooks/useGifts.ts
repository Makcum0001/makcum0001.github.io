import { useState, useEffect, useCallback, useMemo } from 'react';
import { GiftItem } from '../types';
import { subscribeToGifts, deleteGift, updateBooking } from '../api/gifts';

const STORAGE_KEY = 'wishlist-items-v1';

export function useGifts() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [localRemovedItems, setLocalRemovedItems] = useState<Record<string, GiftItem>>({});
  const [pendingPositions, setPendingPositions] = useState<Record<string, number>>({});
  const [optimisticRemoved, setOptimisticRemoved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GiftItem[];
        if (Array.isArray(parsed) && parsed.length) {
          setItems(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    const unsub = subscribeToGifts(setItems, () => {
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const deleteItem = useCallback(async (item: GiftItem) => {
    const id = item.id;
    console.debug('deleteItem (optimistic) called for', id, item.name);

    const idx = items.findIndex(i => i.id === id);
    setPendingPositions(prev => ({ ...prev, [id]: idx >= 0 ? idx : Object.keys(prev).length }));

    setPendingDeletes(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setLocalRemovedItems(prev => ({ ...prev, [id]: item }));

    const ANIM_MS = 420;
    const hideTimer = setTimeout(() => {
      setPendingDeletes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setOptimisticRemoved(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }, ANIM_MS);

    try {
      await deleteGift(id);
      console.debug('deleteGift succeeded for', id);
      clearTimeout(hideTimer);
      setLocalRemovedItems(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setPendingPositions(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setOptimisticRemoved(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error('deleteGift failed, rolling back', err, id);
      clearTimeout(hideTimer);
      setOptimisticRemoved(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setPendingDeletes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setLocalRemovedItems(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setPendingPositions(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      try {
        if (typeof window !== 'undefined') window.alert('Ошибка удаления. Попробуйте ещё раз.');
      } catch (e) {}
    }
  }, [items]);

  const toggleBooked = useCallback(async (id: string, bookedBy?: string) => {
    try {
      // If bookedBy is an empty string we still want to mark as booked, but store null in DB to keep schema tidy
      const value = bookedBy === '' ? null : (bookedBy ?? null);
      await updateBooking(id, value);
    } catch (err) {
      console.error('updateBooking error', err);
      if (typeof window !== 'undefined') {
        window.alert('Не удалось сохранить бронь. Возможно блокировщик или сеть. Попробуйте отключить расширения и обновить страницу.');
      }
    }
  }, []);

  const displayItems = useMemo(() => {
    const list = items.filter(i => !optimisticRemoved.has(i.id));
    Object.keys(pendingPositions).forEach(id => {
      const pos = pendingPositions[id];
      const liveIndex = list.findIndex(i => i.id === id);
      if (optimisticRemoved.has(id)) return;
      const toInsert = list.find(i => i.id === id) || localRemovedItems[id];
      if (!toInsert) return;
      if (liveIndex >= 0) list.splice(liveIndex, 1);
      const insertPos = Math.max(0, Math.min(pos, list.length));
      list.splice(insertPos, 0, toInsert);
    });
    Object.keys(localRemovedItems).forEach(id => {
      if (optimisticRemoved.has(id)) return;
      if (!list.find(i => i.id === id)) {
        list.push(localRemovedItems[id]);
      }
    });
    return list;
  }, [items, localRemovedItems, pendingPositions, optimisticRemoved]);

  return {
    items,
    displayItems,
    loading,
    pendingDeletes,
    deleteItem,
    toggleBooked,
  };
}
