import api from './api';
import type {  Transaction,  TransactionFormData, TransactionStats, TransactionFilters } from '../types';

class TransactionService {
  private endpoint = '/transactions';

  // Listar transações com filtros
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.month !== undefined) {
      params.append('month', String(filters.month + 1)); // +1 porque o backend espera 1-12
    }
    if (filters?.year) {
      params.append('year', String(filters.year));
    }
    if (filters?.card) {
      params.append('card', String(filters.card));
    }
    if (filters?.category) {
      params.append('category', filters.category);
    }

    const response = await api.get<Transaction[]>(
      `${this.endpoint}/?${params.toString()}`
    );
    return response.data;
  }

  // Buscar uma transação específica
  async getById(id: number): Promise<Transaction> {
    const response = await api.get<Transaction>(`${this.endpoint}/${id}/`);
    return response.data;
  }

  // Criar nova transação
  async create(data: TransactionFormData): Promise<Transaction> {
    const response = await api.post<Transaction>(this.endpoint + '/', data);
    return response.data;
  }

  // Atualizar transação
  async update(id: number, data: Partial<TransactionFormData>): Promise<Transaction> {
    const response = await api.patch<Transaction>(`${this.endpoint}/${id}/`, data);
    return response.data;
  }

  // Deletar transação
  async delete(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}/`);
  }

  // Deletar múltiplas transações
  async bulkDelete(ids: number[]): Promise<{ deleted_count: number }> {
    const response = await api.delete(`${this.endpoint}/bulk_delete/`, {
      data: { ids }
    });
    return response.data;
  }

  // Alternar status da transação
  async toggleStatus(id: number): Promise<Transaction> {
    const response = await api.patch<Transaction>(`${this.endpoint}/${id}/toggle_status/`);
    return response.data;
  }

  // Obter estatísticas
  async getStats(filters?: TransactionFilters): Promise<TransactionStats> {
    const params = new URLSearchParams();
    
    if (filters?.month !== undefined) {
      params.append('month', String(filters.month + 1)); // +1 porque o backend espera 1-12
    }
    if (filters?.year) {
      params.append('year', String(filters.year));
    }

    const response = await api.get<TransactionStats>(
      `${this.endpoint}/stats/?${params.toString()}`
    );
    return response.data;
  }

  // Obter transações por categoria
  async getByCategory(filters?: TransactionFilters): Promise<any[]> {
    const params = new URLSearchParams();
    
    if (filters?.month !== undefined) {
      params.append('month', String(filters.month + 1));
    }
    if (filters?.year) {
      params.append('year', String(filters.year));
    }

    const response = await api.get(`${this.endpoint}/by_category/?${params.toString()}`);
    return response.data;
  }
}

export default new TransactionService();