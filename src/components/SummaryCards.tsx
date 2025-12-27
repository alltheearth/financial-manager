// src/components/SummaryCards.tsx
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import type { Totals, Balance } from '../types';

interface SummaryCardsProps {
  totals: Totals;
  balance: Balance;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totals, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-sm">Receitas Confirmadas</p>
            <p className="text-2xl font-bold text-white">
              R$ {totals.confirmedIncome.toFixed(2)}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-200 text-sm">Despesas Confirmadas</p>
            <p className="text-2xl font-bold text-white">
              R$ {totals.confirmedExpense.toFixed(2)}
            </p>
          </div>
          <TrendingDown className="w-8 h-8 text-red-400" />
        </div>
      </div>

      <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Saldo Confirmado</p>
            <p className={`text-2xl font-bold ${balance.confirmed >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {balance.confirmed.toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm">Projeção Final</p>
            <p className={`text-2xl font-bold ${balance.projected >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {balance.projected.toFixed(2)}
            </p>
          </div>
          <Calendar className="w-8 h-8 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;