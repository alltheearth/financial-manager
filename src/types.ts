// src/types.ts

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'confirmed';

export interface Transaction {
  id: number;
  type: TransactionType;
  description: string;
  amount: string;
  category: string;
  date: string;
  status: TransactionStatus;
  isRecurring: boolean;
  isInstallment: boolean;
  installments: number;
  currentInstallment: number;
  cardId: number | null;
  dueDay: number | null;
}

export interface Card {
  id: number;
  name: string;
  dueDay: string;
  color: string;
}

export interface TransactionFormData {
  type: TransactionType;
  description: string;
  amount: string;
  category: string;
  date: string;
  status: TransactionStatus;
  isRecurring: boolean;
  isInstallment: boolean;
  installments: number;
  currentInstallment: number;
  cardId: number | null;
  dueDay: number | null;
}

export interface CardFormData {
  name: string;
  dueDay: string;
  color: string;
}

export interface Totals {
  confirmedIncome: number;
  confirmedExpense: number;
  pendingIncome: number;
  pendingExpense: number;
}

export interface Balance {
  confirmed: number;
  projected: number;
}

export const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Contas', 'Outros']
} as const;