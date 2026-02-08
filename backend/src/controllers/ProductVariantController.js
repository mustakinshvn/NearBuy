import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';

// Create a new variant for a specific product
export const createProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const payload = req.body || {};

    // Ensure parent product exists
    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Parent product not found' });
    }

    const data = {
      ...payload,
      product_id: Number(productId),
    };

    const variant = await ProductVariant.create(data);
    return res
      .status(201)
      .json({ message: 'Product variant created successfully', variant });
  } catch (error) {
    console.error('Error creating product variant:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get all variants for a specific product
export const getProductVariants = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variants = await ProductVariant.getByProductId(Number(productId));
    return res.status(200).json({
      message: 'Product variants fetched successfully',
      product_id: Number(productId),
      variants,
    });
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get a single variant for a specific product
export const getProductVariantById = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variant = await ProductVariant.getById(Number(variantId));
    if (!variant || Number(variant.product_id) !== Number(productId)) {
      return res.status(404).json({ message: 'Variant not found for this product' });
    }

    return res.status(200).json({
      message: 'Product variant fetched successfully',
      variant,
    });
  } catch (error) {
    console.error('Error fetching product variant:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update a variant for a specific product
export const updateProductVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const payload = req.body || {};

    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await ProductVariant.getById(Number(variantId));
    if (!existing || Number(existing.product_id) !== Number(productId)) {
      return res.status(404).json({ message: 'Variant not found for this product' });
    }

    const updated = await ProductVariant.update(Number(variantId), payload);

    return res.status(200).json({
      message: 'Product variant updated successfully',
      variant: updated,
    });
  } catch (error) {
    console.error('Error updating product variant:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete a variant for a specific product
export const deleteProductVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await ProductVariant.getById(Number(variantId));
    if (!existing || Number(existing.product_id) !== Number(productId)) {
      return res.status(404).json({ message: 'Variant not found for this product' });
    }

    const deleted = await ProductVariant.delete(Number(variantId));

    return res.status(200).json({
      message: 'Product variant deleted successfully',
      variant: deleted,
    });
  } catch (error) {
    console.error('Error deleting product variant:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
