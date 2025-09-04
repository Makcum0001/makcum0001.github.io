import React from 'react';

const CATEGORY_OPTIONS = ['до 1000', 'до 2000', 'до 3000', 'другое'];

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="col-span-full flex items-center justify-between gap-3 mb-2">
      {/* mobile select */}
      <select
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        className="block md:hidden rounded-md border px-3 py-2 text-sm"
        aria-label="Выбрать категорию"
      >
        <option value="all">Все категории</option>
        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* desktop pills */}
      <div className="hidden md:flex items-center gap-2">
        <button type="button" onClick={() => onSelectCategory('all')} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-700'}`}>Все</button>
        {CATEGORY_OPTIONS.map(c => (
          <button key={c} type="button" onClick={() => onSelectCategory(c)} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === c ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-700'}`}>{c}</button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
