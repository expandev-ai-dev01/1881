import { authenticatedClient } from '@/core/lib/api';
import type { Product, ProductListParams, ProductListResponse } from '../types';

export const productService = {
  async list(params?: ProductListParams): Promise<ProductListResponse> {
    const { data } = await authenticatedClient.get<{ data: Product[] }>('/product', { params });
    return {
      data: data.data ?? [],
      totalCount: data.data?.length ?? 0,
    };
  },
};
