import type { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}
