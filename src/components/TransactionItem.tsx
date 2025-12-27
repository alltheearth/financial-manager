// src/components/TransactionItem.tsx
import React from 'react';
import { Check, Edit2, Trash2, CreditCard } from 'lucide-react';
import type { Transaction, Card } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  card: Card | undefined;
  onToggleStatus: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  card,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all hover:bg-white/10 ${
        transaction.status === 'confirmed' ? 'border-white/30' : 'border-yellow-400/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => onToggleStatus(transaction.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              transaction.status === 'confirmed'
                ? 'bg-green-500 border-green-500'
                : 'border-yellow-400 hover:border-yellow-300'
            }`}
          >
            {transaction.status === 'confirmed' && <Check className="w-4 h-4 text-white" />}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">{transaction.description}</h3>
              {transaction.isRecurring && (
                <span className="bg-blue-500/30 text-blue-200 text-xs px-2 py-1 rounded-full">
                  Recorrente
                </span>
              )}
              {transaction.isInstallment && (
                <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded-full">
                  Parcela {transaction.currentInstallment}/{transaction.installments}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/60 text-sm">{transaction.category}</span>
              <span className="text-white/40 text-sm">•</span>
              <span className="text-white/60 text-sm">
                {new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
              {card && (
                <>
                  <span className="text-white/40 text-sm">•</span>
                  <span className="text-white/60 text-sm flex items-center gap-1">
                    <CreditCard className="w-3 h-3" style={{ color: card.color }} />
                    {card.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className={`text-xl font-bold ${
              transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'} R$ {parseFloat(transaction.amount).toFixed(2)}
            </p>
            {transaction.status === 'pending' && (
              <span className="text-yellow-400 text-xs">Pendente</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;