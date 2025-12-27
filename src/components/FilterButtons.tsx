// src/components/FilterButtons.tsx
import React from 'react';
import type { TransactionType } from '../types';

interface FilterButtonsProps {
  filter: 'all' | TransactionType;
  onFilterChange: (filter: 'all' | TransactionType) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-lg transition-all ${
          filter === 'all' ? 'bg-white text-purple-900' : 'bg-white/20 text-white'
        }`}
      >
        Todos
      </button>
      <button
        onClick={() => onFilterChange('income')}
        className={`px-4 py-2 rounded-lg transition-all ${
          filter === 'income' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
        }`}
      >
        Receitas
      </button>
      <button
        onClick={() => onFilterChange('expense')}
        className={`px-4 py-2 rounded-lg transition-all ${
          filter === 'expense' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
        }`}
      >
        Despesas
      </button>
    </div>
  );
};

export default FilterButtons;