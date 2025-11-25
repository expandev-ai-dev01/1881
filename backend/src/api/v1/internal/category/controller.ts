/**
 * @summary
 * Category listing controller for catalog navigation
 *
 * @module api/v1/internal/category/controller
 */

import { Request, Response, NextFunction } from 'express';
import { categoryList } from '@/services/product';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/category List Categories
 * @apiName ListCategories
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all active categories with product counts
 *
 * @apiSuccess {Array} data Array of category objects
 * @apiSuccess {Number} data.idCategory Category identifier
 * @apiSuccess {String} data.name Category name
 * @apiSuccess {String} data.description Category description
 * @apiSuccess {Number} data.productCount Number of products in category
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @remarks
     * In production, idAccount would come from authenticated user session
     * For now, using a default account ID
     */
    const idAccount = 1;

    const data = await categoryList({ idAccount });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.message === 'idAccountRequired') {
      res.status(400).json(errorResponse(error.message, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}
