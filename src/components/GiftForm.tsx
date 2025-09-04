import React, { useState } from 'react';
import { addGift } from '../api/gifts';

const CATEGORY_OPTIONS = ['до 1000', 'до 2000', 'до 3000', 'другое'];

interface NewGiftForm {
  name: string;
  description: string;
  category: string;
}

const defaultForm: NewGiftForm = {
  name: '',
  description: '',
  category: CATEGORY_OPTIONS[0],
};

interface GiftFormProps {
  fancy: boolean;
}

const GiftForm: React.FC<GiftFormProps> = ({ fancy }) => {
  const [form, setForm] = useState<NewGiftForm>(defaultForm);

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

  return (
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
  );
};

export default GiftForm;
