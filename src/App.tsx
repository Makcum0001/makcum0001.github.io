import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import photo from './assets/photo.jpg';
import GiftCard from './components/GiftCard';
import { GiftItem } from './types';
import { nanoid } from './utils/nanoid'; // explicit utility import
import { subscribeToGifts, addGift, updateBooking, deleteGift, migrateMissingCreatedAt } from './api/gifts';

const CATEGORY_OPTIONS = ['до 1000', 'до 2000', 'до 3000', 'другое'];

interface NewGiftForm {
  name: string;
  description: string;
  category: string;
}

interface Burst25 {
  id: string;
  // current position
  x: number;
  y: number;
  // velocity px/s
  vx: number;
  vy: number;
  // rotation deg and rotational velocity
  r: number;
  vr: number;
  font: number;
  born: number; // timestamp ms
  color: string;
}

interface MiniFirework {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  size: number;
  born: number;
  color: string;
}

const defaultForm: NewGiftForm = {
  name: '',
  description: '',
  category: CATEGORY_OPTIONS[0],
};

const STORAGE_KEY = 'wishlist-items-v1';

const App: React.FC = () => {
  // Настройки частиц
  const PARTICLE_FADE_START = 2300; // мс после рождения начинаем затухание
  const PARTICLE_FADE_DURATION = 600; // длительность затухания
  const PARTICLE_MAX_LIFE = PARTICLE_FADE_START + PARTICLE_FADE_DURATION; // полная жизнь
  const MAX_PARTICLES = 800; // верхний предел в памяти
  
  const [items, setItems] = useState<GiftItem[]>([]);
  // Hydrate from local cache so UI appears immediately before Firestore responds
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
  
  // Persist items to local cache so future loads are instant
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  // Start in loading state — keep loader available if Firestore takes long.
  // We still hydrate from localStorage above so items render immediately while loading=true.
  const [loading, setLoading] = useState(true);
  // Track pending deletions and keep a local copy so card can animate out
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [localRemovedItems, setLocalRemovedItems] = useState<Record<string, GiftItem>>({});
  // store original positions for items that are pending deletion to keep them stable in the UI
  const [pendingPositions, setPendingPositions] = useState<Record<string, number>>({});
  const [optimisticRemoved, setOptimisticRemoved] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<NewGiftForm>(defaultForm);
  const [profileImage] = useState<string>(photo);
  const [bursts, setBursts] = useState<Burst25[]>([]);
  const [miniFireworks, setMiniFireworks] = useState<MiniFirework[]>([]);
  const burstsRef = useRef<Burst25[]>([]);
  const miniFireworksRef = useRef<MiniFirework[]>([]);
  const rafRef = useRef<number | null>(null);

  // Confirmation modal state & focus handling
  const [confirmTarget, setConfirmTarget] = useState<GiftItem | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  // Focus confirm button when modal opens
  useEffect(() => {
    if (confirmTarget) {
      // delay to allow element to mount
      const t = setTimeout(() => confirmBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [confirmTarget]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmTarget(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Подписываемся на коллекцию gifts через модуль api/gifts
  useEffect(() => {
    const unsub = subscribeToGifts(setItems, () => {
      // stop artificial delay — show cards as soon as data arrives
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleField = (field: keyof NewGiftForm, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await addGift({ name: form.name.trim(), description: form.description.trim(), category: form.category });
      resetForm();
    } catch (err) {
      console.error('addGift error', err);
    }
  };

  const toggleBooked = useCallback(async (id: string, bookedBy?: string) => {
    try {
      await updateBooking(id, bookedBy ?? null);
    } catch (err) {
      console.error('updateBooking error', err);
    }
  }, []);

  const deleteItem = useCallback(async (item: GiftItem) => {
    const id = item.id;
    console.debug('deleteItem (optimistic) called for', id, item.name);

    // capture current index to keep visual position stable
    const idx = items.findIndex(i => i.id === id);
    setPendingPositions(prev => ({ ...prev, [id]: idx >= 0 ? idx : Object.keys(prev).length }));

    // mark pending and keep a local copy for possible rollback
    setPendingDeletes(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setLocalRemovedItems(prev => ({ ...prev, [id]: item }));

    // After animation, hide the item optimistically from UI (so it disappears smoothly)
    const ANIM_MS = 420; // matches UI animation duration
    const hideTimer = setTimeout(() => {
      // remove pending visual state and hide from list
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
      // keep localRemovedItems as backup for rollback until server confirms
    }, ANIM_MS);

    // Fire-and-forget delete; rollback on error
    deleteGift(id).then(() => {
      console.debug('deleteGift succeeded for', id);
      // server removed doc; clean up local caches
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
    }).catch((err) => {
      console.error('deleteGift failed, rolling back', err, id);
      clearTimeout(hideTimer);
      // rollback: unhide and remove local backup
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
      // Optionally: notify user
      try {
        if (typeof window !== 'undefined') window.alert('Ошибка удаления. Попробуйте ещё раз.');
      } catch (e) {}
    });
  }, [items]);

  const confirmAndDelete = useCallback((item: GiftItem) => {
    // Open styled confirmation modal for this item
    setConfirmTarget(item);
  }, [deleteItem]);

  const filtered = useMemo(() => items, [items]);
  // displayItems merges live items with any locally-stashed removed items
  const displayItems = useMemo(() => {
    // start from the live list, excluding any optimistically-removed ids
    const list = items.filter(i => !optimisticRemoved.has(i.id));
     // ensure pending items are placed at their captured positions
    Object.keys(pendingPositions).forEach(id => {
      const pos = pendingPositions[id];
      const liveIndex = list.findIndex(i => i.id === id);
      // skip inserting if item was optimistically removed
      if (optimisticRemoved.has(id)) return;
      const toInsert = list.find(i => i.id === id) || localRemovedItems[id];
      if (!toInsert) return;
      // remove if exists
      if (liveIndex >= 0) list.splice(liveIndex, 1);
      // clamp position
      const insertPos = Math.max(0, Math.min(pos, list.length));
      list.splice(insertPos, 0, toInsert);
    });
    // add any localRemovedItems that are not present (fallback)
    Object.keys(localRemovedItems).forEach(id => {
      if (optimisticRemoved.has(id)) return;
      if (!list.find(i => i.id === id)) {
        list.push(localRemovedItems[id]);
      }
    });
    return list;
  }, [items, localRemovedItems, pendingPositions]);

  const [fancy, setFancy] = useState(true);

  const startLoop = useCallback(() => {
    let last = performance.now();
    const drag = 0.05; // лёгкое замедление по X
    const maxLife = PARTICLE_MAX_LIFE; // мс
    const step = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      let changed = false;
      
      // Обновляем основные частицы (цифры 25)
      burstsRef.current = burstsRef.current.filter(b => {
        const life = now - b.born;
        if (life > maxLife) return false;
        // движение: постоянная скорость вниз
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        // лёгкая потеря горизонтальной скорости
        b.vx *= 1 - drag * dt;
        b.r += b.vr * dt;
        changed = true;
        if (b.y > window.scrollY + window.innerHeight + 120) return false;
        return true;
      });
      
      // Обновляем мини-салюты
      miniFireworksRef.current = miniFireworksRef.current.filter(m => {
        const life = now - m.born;
        if (life > maxLife) return false;
        // движение мини-салютов
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.vx *= 1 - drag * 0.5 * dt; // меньше сопротивления
        m.r += m.vr * dt;
        changed = true;
        if (m.y > window.scrollY + window.innerHeight + 120) return false;
        return true;
      });
      
      if (changed) {
        setBursts([...burstsRef.current]);
        setMiniFireworks([...miniFireworksRef.current]);
      }
      if (burstsRef.current.length || miniFireworksRef.current.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [PARTICLE_MAX_LIFE]);

  const spawn25 = useCallback(() => {
    const count = 60; // плотность
    const now = performance.now();
    const palette = ['rgb(255,0,43)','rgb(228,0,43)','rgba(255,0,43,0.75)','rgba(228,0,43,0.65)'];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const batch: Burst25[] = Array.from({ length: count }, () => {
      const x = Math.random() * vw;                  // любая ширина
      const y = window.scrollY + Math.random() * vh;  // любая высота видимой области
      const vx = (Math.random() * 2 - 1) * 25;        // лёгкий горизонтальный дрейф
      const vy = 50 + Math.random() * 120;            // постоянная скорость вниз
      return {
        id: nanoid(),
        x,
        y,
        vx,
        vy,
        r: Math.random() * 360,
        vr: (Math.random() * 2 - 1) * 60,             // поменьше вращение
        font: 24 + Math.random() * 60,
        born: now,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });
    
    // Добавляем мини-салюты
    const miniCount = count * 3; // в 3 раза больше мелких звёздочек
    const miniStars: MiniFirework[] = Array.from({ length: miniCount }, () => {
      const x = Math.random() * vw;
      const y = window.scrollY + Math.random() * vh;
      const vx = (Math.random() * 2 - 1) * 60;  // больший разброс по горизонтали
      const vy = 30 + Math.random() * 80;       // разные скорости падения
      return {
        id: nanoid(),
        x,
        y,
        vx,
        vy,
        r: Math.random() * 360,
        vr: (Math.random() * 2 - 1) * 180,     // быстрое вращение звёздочек
        size: 8 + Math.random() * 16,          // 8-24px
        born: now,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });
    
    burstsRef.current = [...burstsRef.current, ...batch];
    miniFireworksRef.current = [...miniFireworksRef.current, ...miniStars];
    
    // ограничение по количеству: удаляем самые старые
    if (burstsRef.current.length > MAX_PARTICLES) {
      const overflow = burstsRef.current.length - MAX_PARTICLES;
      burstsRef.current.splice(0, overflow);
    }
    if (miniFireworksRef.current.length > MAX_PARTICLES * 2) {
      const overflow = miniFireworksRef.current.length - MAX_PARTICLES * 2;
      miniFireworksRef.current.splice(0, overflow);
    }
    
    setBursts(burstsRef.current);
    setMiniFireworks(miniFireworksRef.current);
    if (rafRef.current == null) startLoop();
  }, [MAX_PARTICLES, startLoop]);

  // Unified list + category filter
  const FILTER_OPTIONS = ['all', ...CATEGORY_OPTIONS] as const;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const getTime = (it: GiftItem) => {
    const t = (it as any).createdAt;
    if (!t) return 0;
    if (typeof t === 'object' && (t.seconds || t.toDate)) {
      try {
        return (t.seconds ? t.seconds * 1000 : t.toDate().getTime());
      } catch (e) {
        return 0;
      }
    }
    if (t instanceof Date) return t.getTime();
    const parsed = Date.parse(String(t));
    return isNaN(parsed) ? 0 : parsed;
  };

  const filteredList = useMemo(() => {
    const list = displayItems.filter(it => selectedCategory === 'all' || it.category === selectedCategory);
    return list.sort((a, b) => getTime(b) - getTime(a));
  }, [displayItems, selectedCategory]);

  // Show the big centered loader only when we're loading and have no cached/display items
  const showLoader = loading && displayItems.length === 0;

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center px-4 pb-16 ${fancy ? 'design-grid' : ''}`}>
      <header className="relative w-full max-w-3xl pt-6 flex flex-col items-center text-center">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={() => setFancy(f => !f)}
            className="rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium hover:bg-accent/20 transition"
          >
            {fancy ? 'Classic' : 'Fancy'} UI
          </button>
          {loading && displayItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-neutral-50/60 px-3 py-1 text-xs text-neutral-600">Синхронизация…</div>
          )}
          {
            (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
              <button
                type="button"
                onClick={() => migrateMissingCreatedAt().catch(err => console.error(err))}
                className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium hover:bg-red-200 transition"
                title="Fix missing createdAt in Firestore (dev only)"
              >
                Fix timestamps
              </button>
            )
          }
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="font-extrabold tracking-tight text-accent text-2xl sm:text-3xl md:text-4xl leading-snug">
            Wishlist
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative" aria-label="Фото">
              <div className="h-48 w-48 sm:h-56 sm:w-56 rounded-full border-4 border-accent flex items-center justify-center overflow-hidden bg-white shadow-md select-none">
                <img src={profileImage} alt="Фото" className="h-full w-full object-cover pointer-events-none" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-accent drop-shadow-sm select-none">
              Happy Birthday
            </h1>
            <div
              onClick={spawn25}
              className="text-5xl sm:text-6xl font-black text-neutral-900/90 select-none cursor-pointer transition-transform active:scale-90 hover:scale-105"
              title="Fire 25 fireworks"
            >
              25
            </div>
          </div>
        </div>
        <form
          onSubmit={handleAdd}
          className={`mt-8 w-full grid gap-4 rounded-xl p-5 border shadow-sm md:grid-cols-2 ${fancy ? 'glass border-white/40 card-elevated' : 'bg-white border-neutral-200'}`}
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <input
              type="text"
              placeholder="Название подарка"
              value={form.name}
              onChange={(e) => handleField('name', e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <textarea
              placeholder="Пояснение / детали"
              value={form.description}
              onChange={(e) => handleField('description', e.target.value)}
              rows={3}
              className="w-full resize-y rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <select
              value={form.category}
              onChange={(e) => handleField('category', e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none"
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="h-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-booked focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Добавить
            </button>
          </div>
        </form>
  </header>
  <main className="w-full max-w-6xl mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* filter bar */}
        <div className="col-span-full flex items-center justify-between gap-3 mb-2">
          {/* mobile select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block md:hidden rounded-md border px-3 py-2 text-sm"
            aria-label="Выбрать категорию"
          >
            <option value="all">Все категории</option>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* desktop pills */}
          <div className="hidden md:flex items-center gap-2">
            <button type="button" onClick={() => setSelectedCategory('all')} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-700'}`}>Все</button>
            {CATEGORY_OPTIONS.map(c => (
              <button key={c} type="button" onClick={() => setSelectedCategory(c)} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === c ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-700'}`}>{c}</button>
            ))}
          </div>
        </div>

        {showLoader ? (
           // centered circular loader
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
        ) : (
          filteredList.length === 0 ? (
            <p className="col-span-full text-center text-sm text-neutral-500">Пока нет подарков — добавьте первый!</p>
          ) : (
            filteredList.map(item => (
              <GiftCard
                key={item.id}
                item={item}
                onToggle={toggleBooked}
                onDelete={() => confirmAndDelete(item)}
                isDeleting={pendingDeletes.has(item.id)}
              />
            ))
          )
        )}
       </main>
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {/* Основные частицы (цифры 25) */}
        {bursts.map(b => {
          const life = performance.now() - b.born;
          const fadeOutStart = PARTICLE_FADE_START;
          const fadeDuration = PARTICLE_FADE_DURATION;
          const opacity = life < 120
            ? life / 120
            : life > fadeOutStart
              ? Math.max(0, 1 - (life - fadeOutStart) / fadeDuration)
              : 1;
          const norm = Math.min(1, life / 900);
          // easeOutCubic for scale in
          const easeOut = 1 - Math.pow(1 - norm, 3);
          let scale = 0.4 + easeOut * 0.8; // 0.4 -> 1.2
          if (life > fadeOutStart) scale *= 0.9; // slight shrink while fading
          return (
            <div
              key={b.id}
              className="font-black select-none"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) rotate(${Math.round(b.r)}deg) scale(${scale.toFixed(3)})`,
                fontSize: b.font,
                opacity,
                color: b.color,
                textShadow: `0 0 4px ${b.color}55, 0 0 10px ${b.color}55, 0 2px 4px rgba(0,0,0,.25)` ,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
                willChange: 'transform, opacity'
              }}
            >
              25
            </div>
          );
        })}
        
        {/* Мини-салюты (звёздочки) */}
        {miniFireworks.map(m => {
          const life = performance.now() - m.born;
          const fadeOutStart = PARTICLE_FADE_START;
          const fadeDuration = PARTICLE_FADE_DURATION;
          const opacity = life < 100
            ? life / 100
            : life > fadeOutStart
              ? Math.max(0, 1 - (life - fadeOutStart) / fadeDuration)
              : 1;
          const norm = Math.min(1, life / 600);
          const easeOut = 1 - Math.pow(1 - norm, 2);
          let scale = 0.3 + easeOut * 0.7; // 0.3 -> 1.0
          if (life > fadeOutStart) scale *= 0.8;
          return (
            <div
              key={m.id}
              className="font-bold select-none"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${m.x}px, ${m.y}px) translate(-50%, -50%) rotate(${Math.round(m.r)}deg) scale(${scale.toFixed(3)})`,
                fontSize: m.size,
                opacity,
                color: m.color,
                textShadow: `0 0 2px ${m.color}77, 0 0 6px ${m.color}44`,
                filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
                willChange: 'transform, opacity'
              }}
            >
              ✦
            </div>
          );
        })}
      </div>

      {/* Confirmation modal (styled) */}
      {confirmTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmTarget(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative z-50 w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 ease-out translate-y-0"
          >
            <h3 id="confirm-title" className="text-lg font-semibold text-neutral-900">Подтвердите удаление</h3>
            <p className="mt-2 text-sm text-neutral-600">Вы уверены, что хотите удалить подарок <span className="font-semibold">"{confirmTarget.name}"</span>{confirmTarget.category ? ` — ${confirmTarget.category}` : ''}?</p>
            <p className="mt-2 text-xs text-neutral-400 break-words">ID: <span className="font-mono text-xs text-neutral-600">{confirmTarget.id}</span></p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="rounded-md px-4 py-2 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition"
              >
                Отмена
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                onClick={async () => {
                  const it = confirmTarget;
                  setConfirmTarget(null);
                  if (it) {
                    try {
                      await deleteItem(it);
                    } catch (e) {
                      console.error('confirm modal delete error', e);
                    }
                  }
                }}
                className="rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
