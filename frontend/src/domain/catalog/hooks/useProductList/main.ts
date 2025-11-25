import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services';
import type { UseProductListOptions } from './types';

export const useProductList = (options: UseProductListOptions = {}) => {
  const { filters, enabled = true } = options;

  const queryKey = ['products', filters];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => productService.list(filters),
    enabled,
  });

  return {
    products: data?.data ?? [],
    totalCount: data?.totalCount ?? 0,
    ...queryInfo,
  };
};
