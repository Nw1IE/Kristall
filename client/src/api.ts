import type { CatalogData, Order, Stats, User } from './types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('granit_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Ошибка входа');
    }
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Сессия недействительна');
    }
    return res.json();
  },

  async getCatalog(): Promise<CatalogData> {
    const res = await fetch(`${API_BASE}/catalog`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Ошибка загрузки каталога');
    return res.json();
  },

  async saveCatalogItem(category: string, item: unknown): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/catalog/${category}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка сохранения');
    return data;
  },

  async deleteCatalogItem(category: string, id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/catalog/${category}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка удаления');
    return data;
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Ошибка загрузки заказов');
    return res.json();
  },

  async createOrder(order: Partial<Order>): Promise<{ message: string; order: Order }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(order),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка создания заказа');
    return data;
  },

  async updateOrderStatus(id: string, status?: string, paymentUpdate?: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, paymentUpdate }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка обновления');
    return data;
  },

  async deleteOrder(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка удаления заказа');
    return data;
  },

  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Ошибка загрузки статистики');
    return res.json();
  },
};
