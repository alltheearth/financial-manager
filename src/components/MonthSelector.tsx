// src/components/MonthSelector.tsx
import React from 'react';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const YEARS = [2023, 2024, 2025, 2026];

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  return (
    <div className="flex gap-3 mb-4">
      <select 
        value={selectedMonth} 
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
        className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {MONTHS.map((month, idx) => (
          <option key={idx} value={idx} className="bg-slate-800">
            {month}
          </option>
        ))}
      </select>
      
      <select 
        value={selectedYear} 
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {YEARS.map(year => (
          <option key={year} value={year} className="bg-slate-800">
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;