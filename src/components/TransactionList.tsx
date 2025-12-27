// src/components/TransactionList.tsx
import React from 'react';
import TransactionItem from './TransactionItem';
import type { Transaction, Card } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  cards: Card[];
  onToggleStatus: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  cards,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4">Transações</h2>
      
      {sortedTransactions.length === 0 ? (
        <p className="text-white/60 text-center py-8">
          Nenhuma transação encontrada para este período.
        </p>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map(transaction => {
            const card = cards.find(c => c.id === transaction.cardId);
            return (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                card={card}
                onToggleStatus={onToggleStatus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;