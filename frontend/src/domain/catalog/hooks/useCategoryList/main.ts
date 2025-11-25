import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services';

export const useCategoryList = () => {
  const { data, ...queryInfo } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  return {
    categories: data ?? [],
    ...queryInfo,
  };
};
