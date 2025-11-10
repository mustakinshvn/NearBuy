import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, getProductsBySeller, updateProduct, deleteProduct, searchProducts } from '../controllers/ProductController.js';

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

export default router;
