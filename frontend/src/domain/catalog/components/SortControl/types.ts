export type SortOption =
  | 'nome_asc'
  | 'nome_desc'
  | 'preco_asc'
  | 'preco_desc'
  | 'data_cadastro_desc';

export interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}
