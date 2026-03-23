import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, getProductsBySeller, updateProduct, deleteProduct, searchProducts } from '../controllers/ProductController.js';
import { productImagesUpload } from '../middleware/upload.js';
import { productVariantImageUpload } from '../middleware/upload.js';
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

const uploadHandler = (req, res, next) => {
    productImagesUpload(req, res, (err) => {
        if (!err) return next();
        // Normalize Multer errors to JSON
        const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
        return res.status(status).json({ message: err.message || 'File upload failed' });
    });
};

const variantUploadHandler = (req, res, next) => {
    productVariantImageUpload(req, res, (err) => {
        if (!err) return next();
        const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
        return res.status(status).json({ message: err.message || 'File upload failed' });
    });
};

router.post('/', uploadHandler, asyncHandler(createProduct));
router.get('/', asyncHandler(getAllProducts));
router.get('/search', asyncHandler(searchProducts));
router.get('/seller/:sellerId', asyncHandler(getProductsBySeller));
router.get('/:id', asyncHandler(getProductById));
router.put('/:id', uploadHandler, asyncHandler(updateProduct));
router.patch('/:id', uploadHandler, asyncHandler(updateProduct));
router.delete('/:id', asyncHandler(deleteProduct));

// Nested routes for product variants
router.post('/:productId/variants', variantUploadHandler, asyncHandler(createProductVariant));
router.get('/:productId/variants', asyncHandler(getProductVariants));
router.get('/:productId/variants/:variantId', asyncHandler(getProductVariantById));
router.put('/:productId/variants/:variantId', variantUploadHandler, asyncHandler(updateProductVariant));
router.patch('/:productId/variants/:variantId', variantUploadHandler, asyncHandler(updateProductVariant));
router.delete('/:productId/variants/:variantId', asyncHandler(deleteProductVariant));

export default router;
