import { authenticatedClient } from '@/core/lib/api';
import type { Category } from '../types';

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await authenticatedClient.get<{ data: Category[] }>('/category');
    return data.data ?? [];
  },
};
