import React, { useState, useMemo } from 'react';
import { Calendar, CreditCard, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Edit2, Check, X, Filter } from 'lucide-react';

const FinancialManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([
    { id: 1, name: 'Nubank', dueDay: 10, color: '#8A05BE' },
    { id: 2, name: 'Inter', dueDay: 15, color: '#FF7A00' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const categories = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Contas', 'Outros']
  };

  const [formData, setFormData] = useState({
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

  const [cardForm, setCardForm] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setTransactions(transactions.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      ));
    } else {
      const newTransaction = { ...formData, id: Date.now() };
      
      if (formData.isInstallment && formData.installments > 1) {
        const installmentTransactions = [];
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
        setTransactions([...transactions, newTransaction]);
      }
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(),
      ...cardForm
    };
    setCards([...cards, newCard]);
    setCardForm({ name: '', dueDay: '', color: '#8A05BE' });
    setShowCardModal(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const deleteCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
    setTransactions(transactions.map(t => 
      t.cardId === id ? { ...t, cardId: null } : t
    ));
  };

  const editTransaction = (transaction) => {
    setFormData(transaction);
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const toggleStatus = (id) => {
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

  const totals = useMemo(() => {
    const confirmed = filteredTransactions.filter(t => t.status === 'confirmed');
    const pending = filteredTransactions.filter(t => t.status === 'pending');
    
    return {
      confirmedIncome: confirmed.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      confirmedExpense: confirmed.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      pendingIncome: pending.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      pendingExpense: pending.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    };
  }, [filteredTransactions]);

  const balance = {
    confirmed: totals.confirmedIncome - totals.confirmedExpense,
    projected: (totals.confirmedIncome + totals.pendingIncome) - (totals.confirmedExpense + totals.pendingExpense)
  };

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Gestor Financeiro Pessoal
          </h1>
          
          {/* Month Selector */}
          <div className="flex gap-3 mb-4">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx} className="bg-slate-800">{month}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year} className="bg-slate-800">{year}</option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Receitas Confirmadas</p>
                  <p className="text-2xl font-bold text-white">R$ {totals.confirmedIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm">Despesas Confirmadas</p>
                  <p className="text-2xl font-bold text-white">R$ {totals.confirmedExpense.toFixed(2)}</p>
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
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
          
          <button
            onClick={() => setShowCardModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
          >
            <CreditCard className="w-5 h-5" />
            Gerenciar Cartões
          </button>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-purple-900' : 'bg-white/20 text-white'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 rounded-lg transition-all ${filter === 'income' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-lg transition-all ${filter === 'expense' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'}`}
            >
              Despesas
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Transações</h2>
          
          {filteredTransactions.length === 0 ? (
            <p className="text-white/60 text-center py-8">Nenhuma transação encontrada para este período.</p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(transaction => {
                const card = cards.find(c => c.id === transaction.cardId);
                return (
                  <div
                    key={transaction.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all hover:bg-white/10 ${
                      transaction.status === 'confirmed' ? 'border-white/30' : 'border-yellow-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => toggleStatus(transaction.id)}
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
                              <span className="bg-blue-500/30 text-blue-200 text-xs px-2 py-1 rounded-full">Recorrente</span>
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
                          <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.type === 'income' ? '+' : '-'} R$ {parseFloat(transaction.amount).toFixed(2)}
                          </p>
                          {transaction.status === 'pending' && (
                            <span className="text-yellow-400 text-xs">Pendente</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editTransaction(transaction)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Editar Transação' : 'Nova Transação'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    formData.type === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    formData.type === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  Receita
                </button>
              </div>

              <div>
                <label className="block text-white mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="" className="bg-slate-800">Selecione uma categoria</option>
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="w-5 h-5 rounded accent-purple-500"
                  />
                  <span>Transação recorrente (mensal)</span>
                </label>

                <label className="flex items-center gap-3 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isInstallment}
                    onChange={(e) => setFormData({ ...formData, isInstallment: e.target.checked })}
                    className="w-5 h-5 rounded accent-purple-500"
                  />
                  <span>Parcelado</span>
                </label>
              </div>

              {formData.isInstallment && (
                <div>
                  <label className="block text-white mb-2">Número de Parcelas</label>
                  <input
                    type="number"
                    min="2"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              )}

              {formData.type === 'expense' && (
                <div>
                  <label className="block text-white mb-2">Cartão de Crédito (Opcional)</label>
                  <select
                    value={formData.cardId || ''}
                    onChange={(e) => setFormData({ ...formData, cardId: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="" className="bg-slate-800">Nenhum</option>
                    {cards.map(card => (
                      <option key={card.id} value={card.id} className="bg-slate-800">
                        {card.name} (Venc: dia {card.dueDay})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  {editingId ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gerenciar Cartões</h2>
              <button onClick={() => setShowCardModal(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCardSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-white mb-2">Nome do Cartão</label>
                <input
                  type="text"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Dia do Vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={cardForm.dueDay}
                    onChange={(e) => setCardForm({ ...cardForm, dueDay: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Cor</label>
                  <input
                    type="color"
                    value={cardForm.color}
                    onChange={(e) => setCardForm({ ...cardForm, color: e.target.value })}
                    className="w-full h-12 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Adicionar Cartão
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="text-white font-semibold">Cartões Cadastrados</h3>
              {cards.map(card => (
                <div
                  key={card.id}
                  className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: card.color }}
                    />
                    <div>
                      <p className="text-white font-semibold">{card.name}</p>
                      <p className="text-white/60 text-sm">Vencimento: dia {card.dueDay}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManager;