import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, getProductsBySeller, updateProduct, deleteProduct, searchProducts } from '../controllers/ProductController.js';
import {
    createProductVariant,
    getProductVariants,
    getProductVariantById,
    updateProductVariant,
    deleteProductVariant,
} from '../controllers/ProductVariantController.js';

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', asyncHandler(createProduct));
router.get('/', asyncHandler(getAllProducts));
router.get('/search', asyncHandler(searchProducts));
router.get('/seller/:sellerId', asyncHandler(getProductsBySeller));
router.get('/:id', asyncHandler(getProductById));
router.put('/:id', asyncHandler(updateProduct));
router.patch('/:id', asyncHandler(updateProduct));
router.delete('/:id', asyncHandler(deleteProduct));

// Nested routes for product variants
router.post('/:productId/variants', asyncHandler(createProductVariant));
router.get('/:productId/variants', asyncHandler(getProductVariants));
router.get('/:productId/variants/:variantId', asyncHandler(getProductVariantById));
router.put('/:productId/variants/:variantId', asyncHandler(updateProductVariant));
router.patch('/:productId/variants/:variantId', asyncHandler(updateProductVariant));
router.delete('/:productId/variants/:variantId', asyncHandler(deleteProductVariant));

export default router;
