/**
 * @summary
 * Business logic for product catalog operations using in-memory storage
 *
 * @module services/product/productLogic
 */

import {
  ProductListItem,
  ProductDetail,
  CategoryListItem,
  ProductListParams,
  ProductGetParams,
  CategoryListParams,
} from './productTypes';

/**
 * @remarks
 * In-memory storage for categories and products
 * In production, this would be replaced with database calls
 */
const categories: Map<number, CategoryListItem & { idAccount: number; deleted: boolean }> =
  new Map();
const products: Map<number, ProductDetail & { idAccount: number; deleted: boolean }> = new Map();

let nextCategoryId = 1;
let nextProductId = 1;

/**
 * @summary
 * Initialize sample data for demonstration
 */
function initializeSampleData(idAccount: number): void {
  if (categories.size === 0) {
    const sampleCategories = [
      { name: 'Sala de Estar', description: 'Móveis para sala de estar' },
      { name: 'Quarto', description: 'Móveis para quarto' },
      { name: 'Cozinha', description: 'Móveis para cozinha' },
      { name: 'Escritório', description: 'Móveis para escritório' },
    ];

    sampleCategories.forEach((cat) => {
      const id = nextCategoryId++;
      categories.set(id, {
        idCategory: id,
        idAccount,
        name: cat.name,
        description: cat.description,
        productCount: 0,
        deleted: false,
      });
    });

    const sampleProducts = [
      {
        idCategory: 1,
        name: 'Sofá 3 Lugares',
        price: 2500.0,
        dimensions: '200x90x85 cm',
        material: 'Tecido',
        available: true,
      },
      {
        idCategory: 1,
        name: 'Poltrona Reclinável',
        price: 1200.0,
        dimensions: '80x90x100 cm',
        material: 'Couro Sintético',
        available: true,
      },
      {
        idCategory: 2,
        name: 'Cama Box Casal',
        price: 1800.0,
        dimensions: '140x190x60 cm',
        material: 'Madeira',
        available: false,
      },
      {
        idCategory: 2,
        name: 'Guarda-Roupa 6 Portas',
        price: 3200.0,
        dimensions: '280x220x60 cm',
        material: 'MDF',
        available: true,
      },
      {
        idCategory: 3,
        name: 'Mesa de Jantar 6 Lugares',
        price: 1500.0,
        dimensions: '160x90x75 cm',
        material: 'Madeira Maciça',
        available: true,
      },
      {
        idCategory: 4,
        name: 'Escrivaninha',
        price: 800.0,
        dimensions: '120x60x75 cm',
        material: 'MDP',
        available: true,
      },
    ];

    sampleProducts.forEach((prod) => {
      const id = nextProductId++;
      const category = Array.from(categories.values()).find(
        (c) => c.idCategory === prod.idCategory && c.idAccount === idAccount
      );

      products.set(id, {
        idProduct: id,
        idAccount,
        idCategory: prod.idCategory,
        name: prod.name,
        price: prod.price,
        imageUrl: `/assets/images/products/${id}.jpg`,
        imageFallbackUrl: '/assets/images/sem-imagem.jpg',
        imagePlaceholderSvg: null,
        dimensions: prod.dimensions,
        material: prod.material,
        available: prod.available,
        categoryName: category?.name || '',
        dateCreated: new Date(),
        dateModified: new Date(),
        deleted: false,
      });

      if (category) {
        category.productCount++;
      }
    });
  }
}

/**
 * @summary
 * Lists all active categories for an account
 *
 * @function categoryList
 * @module services/product/productLogic
 *
 * @param {CategoryListParams} params - Category list parameters
 *
 * @returns {Promise<CategoryListItem[]>} List of categories
 *
 * @throws {Error} When idAccount is invalid
 */
export async function categoryList(params: CategoryListParams): Promise<CategoryListItem[]> {
  const { idAccount } = params;

  /**
   * @validation Verify required parameter
   */
  if (!idAccount) {
    throw new Error('idAccountRequired');
  }

  initializeSampleData(idAccount);

  const result = Array.from(categories.values())
    .filter((cat) => cat.idAccount === idAccount && !cat.deleted)
    .map((cat) => ({
      idCategory: cat.idCategory,
      name: cat.name,
      description: cat.description,
      productCount: cat.productCount,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

/**
 * @summary
 * Lists products with pagination, filtering, and sorting
 *
 * @function productList
 * @module services/product/productLogic
 *
 * @param {ProductListParams} params - Product list parameters
 *
 * @returns {Promise<ProductListItem[]>} List of products
 *
 * @throws {Error} When parameters are invalid
 */
export async function productList(params: ProductListParams): Promise<ProductListItem[]> {
  const { idAccount, idCategory, sortBy, page, pageSize } = params;

  /**
   * @validation Verify required parameters
   */
  if (!idAccount) {
    throw new Error('idAccountRequired');
  }

  if (!page || page < 1) {
    throw new Error('pageInvalid');
  }

  if (!pageSize || ![12, 24, 36].includes(pageSize)) {
    throw new Error('pageSizeInvalid');
  }

  if (
    !['nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc'].includes(sortBy)
  ) {
    throw new Error('sortByInvalid');
  }

  /**
   * @validation Verify category exists if provided
   */
  if (idCategory !== null && idCategory !== undefined) {
    const categoryExists = Array.from(categories.values()).some(
      (cat) => cat.idCategory === idCategory && cat.idAccount === idAccount && !cat.deleted
    );

    if (!categoryExists) {
      throw new Error('categoryDoesntExist');
    }
  }

  initializeSampleData(idAccount);

  let filteredProducts = Array.from(products.values()).filter(
    (prod) => prod.idAccount === idAccount && !prod.deleted
  );

  if (idCategory !== null && idCategory !== undefined) {
    filteredProducts = filteredProducts.filter((prod) => prod.idCategory === idCategory);
  }

  const totalCount = filteredProducts.length;

  /**
   * @rule {be-sorting-logic}
   * Apply sorting based on sortBy parameter
   */
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'nome_asc':
        return a.name.localeCompare(b.name);
      case 'nome_desc':
        return b.name.localeCompare(a.name);
      case 'preco_asc':
        return a.price - b.price;
      case 'preco_desc':
        return b.price - a.price;
      case 'data_cadastro_desc':
        return b.dateCreated.getTime() - a.dateCreated.getTime();
      default:
        return 0;
    }
  });

  /**
   * @rule {be-pagination-logic}
   * Apply pagination
   */
  const offset = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(offset, offset + pageSize);

  return paginatedProducts.map((prod) => ({
    idProduct: prod.idProduct,
    name: prod.name,
    price: prod.price,
    imageUrl: prod.imageUrl,
    imageFallbackUrl: prod.imageFallbackUrl,
    imagePlaceholderSvg: prod.imagePlaceholderSvg,
    dimensions: prod.dimensions,
    material: prod.material,
    available: prod.available,
    categoryName: prod.categoryName,
    totalCount,
  }));
}

/**
 * @summary
 * Retrieves detailed information for a specific product
 *
 * @function productGet
 * @module services/product/productLogic
 *
 * @param {ProductGetParams} params - Product get parameters
 *
 * @returns {Promise<ProductDetail>} Product details
 *
 * @throws {Error} When product doesn't exist
 */
export async function productGet(params: ProductGetParams): Promise<ProductDetail> {
  const { idAccount, idProduct } = params;

  /**
   * @validation Verify required parameters
   */
  if (!idAccount) {
    throw new Error('idAccountRequired');
  }

  if (!idProduct) {
    throw new Error('idProductRequired');
  }

  initializeSampleData(idAccount);

  const product = products.get(idProduct);

  /**
   * @validation Verify product exists
   */
  if (!product || product.idAccount !== idAccount || product.deleted) {
    throw new Error('productDoesntExist');
  }

  return {
    idProduct: product.idProduct,
    idCategory: product.idCategory,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    imageFallbackUrl: product.imageFallbackUrl,
    imagePlaceholderSvg: product.imagePlaceholderSvg,
    dimensions: product.dimensions,
    material: product.material,
    available: product.available,
    categoryName: product.categoryName,
    dateCreated: product.dateCreated,
    dateModified: product.dateModified,
  };
}
