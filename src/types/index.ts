// src/types.ts

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'confirmed';

// Tipos da API (snake_case)
export interface Transaction {
  id: number;
  type: TransactionType;
  description: string;
  amount: string;
  category: string;
  date: string;
  status: TransactionStatus;
  is_recurring: boolean;
  is_installment: boolean;
  installments: number;
  current_installment: number;
  card: number | null;
  card_details?: Card;
  created_at?: string;
  updated_at?: string;
}

export interface Card {
  id: number;
  name: string;
  due_day: number;
  color: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para formulários (enviados para API)
export interface TransactionFormData {
  type: TransactionType;
  description: string;
  amount: string | number;
  category: string;
  date: string;
  status?: TransactionStatus;
  is_recurring?: boolean;
  is_installment?: boolean;
  installments?: number;
  card?: number | null;
}

export interface CardFormData {
  name: string;
  due_day: string | number;
  color: string;
}

export interface TransactionStats {
  confirmed_income: number;
  confirmed_expense: number;
  pending_income: number;
  pending_expense: number;
  confirmed_balance: number;
  projected_balance: number;
  total_transactions: number;
}

export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all';
  status?: 'pending' | 'confirmed';
  month?: number;
  year?: number;
  card?: number;
  category?: string;
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