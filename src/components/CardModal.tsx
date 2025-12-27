// src/components/CardModal.tsx
import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Card, CardFormData } from '../types';

interface CardModalProps {
  isOpen: boolean;
  cards: Card[];
  cardForm: CardFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: Partial<CardFormData>) => void;
  onDeleteCard: (id: number) => void;
}

const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  cards,
  cardForm,
  onClose,
  onSubmit,
  onFormChange,
  onDeleteCard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gerenciar Cartões</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-white mb-2">Nome do Cartão</label>
            <input
              type="text"
              value={cardForm.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
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
                onChange={(e) => onFormChange({ dueDay: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Cor</label>
              <input
                type="color"
                value={cardForm.color}
                onChange={(e) => onFormChange({ color: e.target.value })}
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Adicionar Cartão
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="text-white font-semibold">Cartões Cadastrados</h3>
          {cards.length === 0 ? (
            <p className="text-white/60 text-center py-4">Nenhum cartão cadastrado.</p>
          ) : (
            cards.map(card => (
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
                  onClick={() => onDeleteCard(card.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CardModal;