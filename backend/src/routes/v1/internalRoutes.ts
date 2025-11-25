/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as categoryController from '@/api/v1/internal/category/controller';
import * as productController from '@/api/v1/internal/product/controller';

const router = Router();

/**
 * @rule {be-route-organization}
 * Category routes for catalog navigation
 */
router.get('/category', categoryController.listHandler);

/**
 * @rule {be-route-organization}
 * Product routes for catalog display
 */
router.get('/product', productController.listHandler);
router.get('/product/:id', productController.getHandler);

export default router;
