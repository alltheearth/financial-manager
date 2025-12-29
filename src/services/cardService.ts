import api from './api';
import type { Card, CardFormData } from '../types';

class CardService {
  private endpoint = '/cards';

  // Listar todos os cartões
  async getAll(): Promise<Card[]> {
    const response = await api.get<Card[]>(this.endpoint + '/');
    return response.data;
  }

  // Buscar um cartão específico
  async getById(id: number): Promise<Card> {
    const response = await api.get<Card>(`${this.endpoint}/${id}/`);
    return response.data;
  }

  // Criar novo cartão
  async create(data: CardFormData): Promise<Card> {
    const response = await api.post<Card>(this.endpoint + '/', data);
    return response.data;
  }

  // Atualizar cartão
  async update(id: number, data: Partial<CardFormData>): Promise<Card> {
    const response = await api.patch<Card>(`${this.endpoint}/${id}/`, data);
    return response.data;
  }

  // Deletar cartão
  async delete(id: number): Promise<void> {
    await api.delete(`${this.endpoint}/${id}/`);
  }
}

export default new CardService();