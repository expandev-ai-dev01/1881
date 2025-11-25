/**
 * @summary
 * Product catalog controllers for listing and detail views
 *
 * @module api/v1/internal/product/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productList, productGet } from '@/services/product';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @rule {be-zod-validation}
 * Validation schemas for product endpoints
 */
const listQuerySchema = z.object({
  idCategory: z.coerce.number().int().positive().optional(),
  sortBy: z
    .enum(['nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc'])
    .default('nome_asc'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((val) => [12, 24, 36].includes(val), {
      message: 'pageSize must be 12, 24, or 36',
    })
    .default(12),
});

const getParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * @api {get} /api/v1/internal/product List Products
 * @apiName ListProducts
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists products with pagination, filtering, and sorting
 *
 * @apiParam {Number} [idCategory] Filter by category ID
 * @apiParam {String} [sortBy=nome_asc] Sort criteria (nome_asc, nome_desc, preco_asc, preco_desc, data_cadastro_desc)
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [pageSize=12] Products per page (12, 24, or 36)
 *
 * @apiSuccess {Array} data Array of product objects
 * @apiSuccess {Number} data.idProduct Product identifier
 * @apiSuccess {String} data.name Product name
 * @apiSuccess {Number} data.price Product price
 * @apiSuccess {String} data.imageUrl Main image URL
 * @apiSuccess {String} data.imageFallbackUrl Fallback image URL
 * @apiSuccess {String} data.imagePlaceholderSvg SVG placeholder
 * @apiSuccess {String} data.dimensions Product dimensions
 * @apiSuccess {String} data.material Main material
 * @apiSuccess {Boolean} data.available Availability status
 * @apiSuccess {String} data.categoryName Category name
 * @apiSuccess {Number} data.totalCount Total products matching filter
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = listQuerySchema.parse(req.query);

    /**
     * @remarks
     * In production, idAccount would come from authenticated user session
     * For now, using a default account ID
     */
    const idAccount = 1;

    const data = await productList({
      idAccount,
      idCategory: validated.idCategory ?? null,
      sortBy: validated.sortBy,
      page: validated.page,
      pageSize: validated.pageSize,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (
      [
        'idAccountRequired',
        'pageInvalid',
        'pageSizeInvalid',
        'sortByInvalid',
        'categoryDoesntExist',
      ].includes(error.message)
    ) {
      res.status(400).json(errorResponse(error.message, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /api/v1/internal/product/:id Get Product
 * @apiName GetProduct
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific product
 *
 * @apiParam {Number} id Product identifier
 *
 * @apiSuccess {Object} data Product details
 * @apiSuccess {Number} data.idProduct Product identifier
 * @apiSuccess {Number} data.idCategory Category identifier
 * @apiSuccess {String} data.name Product name
 * @apiSuccess {Number} data.price Product price
 * @apiSuccess {String} data.imageUrl Main image URL
 * @apiSuccess {String} data.imageFallbackUrl Fallback image URL
 * @apiSuccess {String} data.imagePlaceholderSvg SVG placeholder
 * @apiSuccess {String} data.dimensions Product dimensions
 * @apiSuccess {String} data.material Main material
 * @apiSuccess {Boolean} data.available Availability status
 * @apiSuccess {String} data.categoryName Category name
 * @apiSuccess {Date} data.dateCreated Creation date
 * @apiSuccess {Date} data.dateModified Last modification date
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Product not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = getParamsSchema.parse(req.params);

    /**
     * @remarks
     * In production, idAccount would come from authenticated user session
     * For now, using a default account ID
     */
    const idAccount = 1;

    const data = await productGet({
      idAccount,
      idProduct: validated.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'productDoesntExist') {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (['idAccountRequired', 'idProductRequired'].includes(error.message)) {
      res.status(400).json(errorResponse(error.message, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}
