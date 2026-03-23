import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import { getUploadedProductImagePaths } from '../middleware/upload.js';
import { toPublicUrl } from '../lib/publicUrl.js';
import { normalizeProductPayload } from '../lib/requestCoercion.js';

// Create a new product
//
// Request body may optionally include a `variants` array. Base product
// fields are stored in the products table, while each variant object is
// inserted into the product_variants table with the created product_id.
//
// Example payload:
// {
//   "title": "T-Shirt",
//   "price": 1000,
//   ...other product fields,
//   "variants": [
//     { "sku": "TS-RED-M", "variant_name": "Red / M", "color": "Red", "size": "M", "stock_quantity": 10 },
//     { "sku": "TS-BLK-L", "variant_name": "Black / L", "color": "Black", "size": "L", "stock_quantity": 5 }
//   ]
// }
export const createProduct = async (req, res) => {
    try {
        const payload = normalizeProductPayload(req.body);

        // Merge optional uploaded images
        const { mainImagePath, imagePaths, variantImagePaths } = getUploadedProductImagePaths(req);
        if (mainImagePath) {
            payload.main_image_url = toPublicUrl(req, mainImagePath);
        }
        if (imagePaths.length > 0) {
            const uploadedUrls = imagePaths.map((p) => toPublicUrl(req, p));
            const existing = Array.isArray(payload.image_urls) ? payload.image_urls : null;
            payload.image_urls = existing ? [...existing, ...uploadedUrls] : uploadedUrls;
            if (!payload.main_image_url) {
                payload.main_image_url = uploadedUrls[0];
            }
        }

        if (Array.isArray(payload.variants) && payload.variants.length > 0 && variantImagePaths.length > 0) {
            const variantUrls = variantImagePaths.map((p) => toPublicUrl(req, p));
            payload.variants = payload.variants.map((variant) => {
                if (!variant || typeof variant !== 'object') return variant;
                const idx = variant.__imageFileIndex;
                if (idx === undefined || idx === null || idx === '') return variant;
                const n = parseInt(String(idx), 10);
                if (Number.isNaN(n) || n < 0 || n >= variantUrls.length) return variant;
                return { ...variant, image_url: variantUrls[n] };
            });
        }

        if (!payload.title || payload.price == null) {
            return res.status(400).json({ message: 'title and price are required' });
        }

        const { variants, ...productData } = payload;

        // Create base product row
        const product = await Product.create(productData);

        // Optionally create variants if provided
        let createdVariants = [];
        if (Array.isArray(variants) && variants.length > 0) {
            const productId = product.product_id;
            const promises = variants.map((variant) =>
                ProductVariant.create({ ...variant, product_id: productId })
            );
            createdVariants = await Promise.all(promises);
        }

        // Refetch with aggregated variants so the response shape
        // is consistent with other read endpoints
        const productWithVariants = await Product.getById(product.product_id);

        res.status(201).json({
            message: 'Product created successfully',
            product: productWithVariants || product,
            variants: createdVariants,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all products (supports ?limit=&offset=)
export const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 100;
        const offset = parseInt(req.query.offset, 10) || 0;
        const products = await Product.getAll({ limit, offset });
        res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product fetched successfully', product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get products by seller
export const getProductsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.getBySeller(sellerId);
        res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) {
        console.error('Error fetching products by seller:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Search products by title (query param: ?title=...)
export const searchProducts = async (req, res) => {
    try {
        const title = req.query.title;
        if (!title) {
            return res.status(400).json({ message: 'Query parameter "title" is required' });
        }
        const limit = parseInt(req.query.limit, 10) || 100;
        const offset = parseInt(req.query.offset, 10) || 0;
        const products = await Product.searchByTitle(title, { limit, offset });
        res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = normalizeProductPayload(req.body);

        // Merge optional uploaded images
        const { mainImagePath, imagePaths } = getUploadedProductImagePaths(req);
        if (mainImagePath) {
            payload.main_image_url = toPublicUrl(req, mainImagePath);
        }
        if (imagePaths.length > 0) {
            const uploadedUrls = imagePaths.map((p) => toPublicUrl(req, p));
            const existing = Array.isArray(payload.image_urls)
                ? payload.image_urls
                : payload.image_urls
                  ? [payload.image_urls]
                  : null;
            payload.image_urls = existing ? [...existing, ...uploadedUrls] : uploadedUrls;
            if (!payload.main_image_url) {
                payload.main_image_url = uploadedUrls[0];
            }
        }

        const updated = await Product.update(id, payload);
        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: updated });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', product: deleted });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
