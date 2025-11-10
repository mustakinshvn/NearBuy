import Product from '../models/Product.js';

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload.title || payload.price == null) {
            return res.status(400).json({ message: 'title and price are required' });
        }

        const product = await Product.create(payload);
        res.status(201).json({ message: 'Product created successfully', product });
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
        const payload = req.body;
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
