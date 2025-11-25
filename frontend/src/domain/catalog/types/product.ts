export interface Product {
  idProduct: number;
  name: string;
  price: number;
  imageUrl: string;
  imageFallbackUrl: string;
  imagePlaceholderSvg: string;
  dimensions: string;
  material: string;
  available: boolean;
  categoryName: string;
}

export interface ProductListParams {
  idCategory?: number;
  sortBy?: 'nome_asc' | 'nome_desc' | 'preco_asc' | 'preco_desc' | 'data_cadastro_desc';
  page?: number;
  pageSize?: 12 | 24 | 36;
}

export interface ProductListResponse {
  data: Product[];
  totalCount: number;
}
