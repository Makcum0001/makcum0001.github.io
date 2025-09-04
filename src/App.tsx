import React, { useCallback, useEffect, useMemo, useState } from 'react';
import GiftCard from './components/GiftCard';
import { GiftItem } from './types';
import { useGifts } from './hooks/useGifts';
import { useParticles } from './hooks/useParticles';
import Header from './components/Header';
import GiftForm from './components/GiftForm';
import FilterBar from './components/FilterBar';
import ConfirmationModal from './components/ConfirmationModal';
import ParticleLayer from './components/ParticleLayer';
import Loader from './components/Loader';

const CATEGORY_OPTIONS = ['до 1000', 'до 2000', 'до 3000', 'другое'];

const App: React.FC = () => {
  const {
    displayItems,
    loading,
    pendingDeletes,
    deleteItem,
    toggleBooked,
  } = useGifts();

  const { bursts, miniFireworks, spawn25, PARTICLE_FADE_START, PARTICLE_FADE_DURATION } = useParticles();

  const [confirmTarget, setConfirmTarget] = useState<GiftItem | null>(null);
  const [fancy, setFancy] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const confirmAndDelete = useCallback((item: GiftItem) => {
    setConfirmTarget(item);
  }, []);

  const handleConfirmDelete = useCallback(async (item: GiftItem) => {
    setConfirmTarget(null);
    try {
      await deleteItem(item);
    } catch (e) {
      console.error('confirm modal delete error', e);
    }
  }, [deleteItem]);

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

  const showLoader = loading && displayItems.length === 0;

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center px-4 pb-16 ${fancy ? 'design-grid' : ''}`}>
      <Header
        fancy={fancy}
        loading={loading}
        hasItems={displayItems.length > 0}
        onToggleFancy={() => setFancy(f => !f)}
        onSpawn25={spawn25}
      >
        <GiftForm fancy={fancy} />
      </Header>
      <main className="w-full max-w-6xl mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <FilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {showLoader ? (
          <Loader />
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
      <ParticleLayer
        bursts={bursts}
        miniFireworks={miniFireworks}
        fadeStart={PARTICLE_FADE_START}
        fadeDuration={PARTICLE_FADE_DURATION}
      />
      <ConfirmationModal
        item={confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default App;
