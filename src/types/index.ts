// Types para a aplicação
export interface Card {
  id: number;
  name: string;
  due_day: number;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface CardFormData {
  name: string;
  due_day: string | number;
  color: string;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: string | number;
  category: string;
  date: string;
  status: 'pending' | 'confirmed';
  is_recurring: boolean;
  is_installment: boolean;
  installments: number;
  current_installment: number;
  card: number | null;
  card_details?: Card;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  description: string;
  amount: string | number;
  category: string;
  date: string;
  status?: 'pending' | 'confirmed';
  is_recurring?: boolean;
  is_installment?: boolean;
  installments?: number;
  card?: number | null;
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