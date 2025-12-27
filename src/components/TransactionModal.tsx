// src/components/TransactionModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { type TransactionFormData, type Card, CATEGORIES } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  formData: TransactionFormData;
  cards: Card[];
  editingId: number | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: Partial<TransactionFormData>) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  formData,
  cards,
  editingId,
  onClose,
  onSubmit,
  onFormChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingId ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onFormChange({ type: 'expense', category: '' })}
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
              onClick={() => onFormChange({ type: 'income', category: '' })}
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
              onChange={(e) => onFormChange({ description: e.target.value })}
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
                onChange={(e) => onFormChange({ amount: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => onFormChange({ date: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => onFormChange({ category: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="" className="bg-slate-800">Selecione uma categoria</option>
              {CATEGORIES[formData.type].map(cat => (
                <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => onFormChange({ isRecurring: e.target.checked })}
                className="w-5 h-5 rounded accent-purple-500"
              />
              <span>Transação recorrente (mensal)</span>
            </label>

            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isInstallment}
                onChange={(e) => onFormChange({ isInstallment: e.target.checked })}
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
                onChange={(e) => onFormChange({ installments: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          {formData.type === 'expense' && (
            <div>
              <label className="block text-white mb-2">Cartão de Crédito (Opcional)</label>
              <select
                value={formData.cardId || ''}
                onChange={(e) => onFormChange({ cardId: e.target.value ? parseInt(e.target.value) : null })}
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
              onClick={onClose}
              className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {editingId ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;