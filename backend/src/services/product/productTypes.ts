/**
 * @summary
 * Type definitions for product catalog management
 *
 * @module services/product/productTypes
 */

/**
 * @interface ProductListItem
 * @description Product information for catalog listing
 *
 * @property {number} idProduct - Product identifier
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {string} imageUrl - Main image URL
 * @property {string} imageFallbackUrl - Fallback image URL
 * @property {string | null} imagePlaceholderSvg - SVG placeholder for loading
 * @property {string} dimensions - Product dimensions
 * @property {string} material - Main material
 * @property {boolean} available - Availability status
 * @property {string} categoryName - Category name
 * @property {number} totalCount - Total products matching filter
 */
export interface ProductListItem {
  idProduct: number;
  name: string;
  price: number;
  imageUrl: string;
  imageFallbackUrl: string;
  imagePlaceholderSvg: string | null;
  dimensions: string;
  material: string;
  available: boolean;
  categoryName: string;
  totalCount: number;
}

/**
 * @interface ProductDetail
 * @description Detailed product information
 *
 * @property {number} idProduct - Product identifier
 * @property {number} idCategory - Category identifier
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {string} imageUrl - Main image URL
 * @property {string} imageFallbackUrl - Fallback image URL
 * @property {string | null} imagePlaceholderSvg - SVG placeholder
 * @property {string} dimensions - Product dimensions
 * @property {string} material - Main material
 * @property {boolean} available - Availability status
 * @property {string} categoryName - Category name
 * @property {Date} dateCreated - Creation date
 * @property {Date} dateModified - Last modification date
 */
export interface ProductDetail {
  idProduct: number;
  idCategory: number;
  name: string;
  price: number;
  imageUrl: string;
  imageFallbackUrl: string;
  imagePlaceholderSvg: string | null;
  dimensions: string;
  material: string;
  available: boolean;
  categoryName: string;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface CategoryListItem
 * @description Category information for navigation
 *
 * @property {number} idCategory - Category identifier
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {number} productCount - Number of products in category
 */
export interface CategoryListItem {
  idCategory: number;
  name: string;
  description: string;
  productCount: number;
}

/**
 * @interface ProductListParams
 * @description Parameters for product listing
 *
 * @property {number} idAccount - Account identifier
 * @property {number | null} idCategory - Filter by category (optional)
 * @property {string} sortBy - Sort criteria
 * @property {number} page - Page number (1-based)
 * @property {number} pageSize - Products per page
 */
export interface ProductListParams {
  idAccount: number;
  idCategory: number | null;
  sortBy: string;
  page: number;
  pageSize: number;
}

/**
 * @interface ProductGetParams
 * @description Parameters for retrieving product details
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduct - Product identifier
 */
export interface ProductGetParams {
  idAccount: number;
  idProduct: number;
}

/**
 * @interface CategoryListParams
 * @description Parameters for category listing
 *
 * @property {number} idAccount - Account identifier
 */
export interface CategoryListParams {
  idAccount: number;
}
