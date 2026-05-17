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
import { ROUTES } from '../lib/ROUTES.js';

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

router.post(ROUTES.PRODUCTS.BASE, uploadHandler, asyncHandler(createProduct));
router.get(ROUTES.PRODUCTS.BASE, asyncHandler(getAllProducts));
router.get(ROUTES.PRODUCTS.SEARCH, asyncHandler(searchProducts));
router.get(ROUTES.PRODUCTS.BY_SELLER, asyncHandler(getProductsBySeller));
router.get(ROUTES.PRODUCTS.BY_ID, asyncHandler(getProductById));
router.put(ROUTES.PRODUCTS.BY_ID, uploadHandler, asyncHandler(updateProduct));
router.patch(ROUTES.PRODUCTS.BY_ID, uploadHandler, asyncHandler(updateProduct));
router.delete(ROUTES.PRODUCTS.BY_ID, asyncHandler(deleteProduct));

// Nested routes for product variants
router.post(ROUTES.PRODUCTS.VARIANTS, variantUploadHandler, asyncHandler(createProductVariant));
router.get(ROUTES.PRODUCTS.VARIANTS, asyncHandler(getProductVariants));
router.get(ROUTES.PRODUCTS.VARIANT_BY_ID, asyncHandler(getProductVariantById));
router.put(ROUTES.PRODUCTS.VARIANT_BY_ID, variantUploadHandler, asyncHandler(updateProductVariant));
router.patch(ROUTES.PRODUCTS.VARIANT_BY_ID, variantUploadHandler, asyncHandler(updateProductVariant));
router.delete(ROUTES.PRODUCTS.VARIANT_BY_ID, asyncHandler(deleteProductVariant));

export default router;
