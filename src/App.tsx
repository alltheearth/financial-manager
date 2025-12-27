// src/App.tsx
import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, CreditCard } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import MonthSelector from './components/MonthSelector';
import FilterButtons from './components/FilterButtons';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import CardModal from "./components/CardModal";
import type {
  Transaction,
  Card,
  TransactionFormData,
  CardFormData,
  TransactionType,
  Totals,
  Balance,
} from './types';

const FinancialManager: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([
    { id: 1, name: 'Nubank', dueDay: '10', color: '#8A05BE' },
    { id: 2, name: 'Inter', dueDay: '15', color: '#FF7A00' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    isRecurring: false,
    isInstallment: false,
    installments: 1,
    currentInstallment: 1,
    cardId: null,
    dueDay: null
  });

  const [cardForm, setCardForm] = useState<CardFormData>({
    name: '',
    dueDay: '',
    color: '#8A05BE'
  });

  const resetForm = () => {
    setFormData({
      type: 'expense',
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      isRecurring: false,
      isInstallment: false,
      installments: 1,
      currentInstallment: 1,
      cardId: null,
      dueDay: null
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setTransactions(transactions.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      ));
    } else {
      if (formData.isInstallment && formData.installments > 1) {
        const installmentTransactions: Transaction[] = [];
        const baseDate = new Date(formData.date);
        const amount = parseFloat(formData.amount);
        const installmentAmount = amount / formData.installments;

        for (let i = 0; i < formData.installments; i++) {
          const installmentDate = new Date(baseDate);
          installmentDate.setMonth(baseDate.getMonth() + i);
          
          installmentTransactions.push({
            ...formData,
            id: Date.now() + i,
            amount: installmentAmount.toFixed(2),
            date: installmentDate.toISOString().split('T')[0],
            currentInstallment: i + 1,
            description: `${formData.description} (${i + 1}/${formData.installments})`
          });
        }
        setTransactions([...transactions, ...installmentTransactions]);
      } else {
        const newTransaction: Transaction = { ...formData, id: Date.now() };
        setTransactions([...transactions, newTransaction]);
      }
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: Card = {
      id: Date.now(),
      ...cardForm
    };
    setCards([...cards, newCard]);
    setCardForm({ name: '', dueDay: '', color: '#8A05BE' });
    setShowCardModal(false);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const deleteCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id));
    setTransactions(transactions.map(t => 
      t.cardId === id ? { ...t, cardId: null } : t
    ));
  };

  const editTransaction = (transaction: Transaction) => {
    setFormData(transaction);
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const toggleStatus = (id: number) => {
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, status: t.status === 'confirmed' ? 'pending' : 'confirmed' } : t
    ));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const matchesMonth = tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear;
      const matchesFilter = filter === 'all' || t.type === filter;
      return matchesMonth && matchesFilter;
    });
  }, [transactions, selectedMonth, selectedYear, filter]);

  const totals = useMemo<Totals>(() => {
    const confirmed = filteredTransactions.filter(t => t.status === 'confirmed');
    const pending = filteredTransactions.filter(t => t.status === 'pending');
    
    return {
      confirmedIncome: confirmed.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      confirmedExpense: confirmed.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      pendingIncome: pending.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      pendingExpense: pending.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    };
  }, [filteredTransactions]);

  const balance = useMemo<Balance>(() => ({
    confirmed: totals.confirmedIncome - totals.confirmedExpense,
    projected: (totals.confirmedIncome + totals.pendingIncome) - (totals.confirmedExpense + totals.pendingExpense)
  }), [totals]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Gestor Financeiro Pessoal
          </h1>
          
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          <SummaryCards totals={totals} balance={balance} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
          
          <button
            onClick={() => setShowCardModal(true)}
            className="bg-linear-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
          >
            <CreditCard className="w-5 h-5" />
            Gerenciar Cartões
          </button>

          <div className="ml-auto">
            <FilterButtons filter={filter} onFilterChange={setFilter} />
          </div>
        </div>

        {/* Transactions List */}
        <TransactionList
          transactions={filteredTransactions}
          cards={cards}
          onToggleStatus={toggleStatus}
          onEdit={editTransaction}
          onDelete={deleteTransaction}
        />
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={showModal}
        formData={formData}
        cards={cards}
        editingId={editingId}
        onClose={() => { setShowModal(false); resetForm(); }}
        onSubmit={handleSubmit}
        onFormChange={(data) => setFormData({ ...formData, ...data })}
      />

      <CardModal
        isOpen={showCardModal}
        cards={cards}
        cardForm={cardForm}
        onClose={() => setShowCardModal(false)}
        onSubmit={handleCardSubmit}
        onFormChange={(data) => setCardForm({ ...cardForm, ...data })}
        onDeleteCard={deleteCard}
      />
    </div>
  );
};

export default FinancialManager;