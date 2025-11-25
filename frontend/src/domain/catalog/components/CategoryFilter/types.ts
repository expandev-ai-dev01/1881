import type { Category } from '../../types';

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: number;
  onCategoryChange: (categoryId?: number) => void;
}
