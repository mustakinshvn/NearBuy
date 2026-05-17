import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import { getUploadedSingleImagePath } from '../middleware/upload.js';
import { toPublicUrl } from '../lib/publicUrl.js';
import { normalizeVariantPayload } from '../lib/requestCoercion.js';
import { getMessage } from '../resources/messages.js';

// Create a new variant for a specific product
export const createProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const payload = normalizeVariantPayload(req.body || {});

    const uploadedPath = getUploadedSingleImagePath(req, 'products/variants');
    if (uploadedPath) {
      payload.image_url = toPublicUrl(req, uploadedPath);
    }

    // Ensure parent product exists
    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: getMessage('ProductVariant.Create.Validation.ParentProductNotFound') });
    }

    const data = {
      ...payload,
      product_id: Number(productId),
    };

    const variant = await ProductVariant.create(data);
    return res
      .status(201)
      .json({ message: getMessage('ProductVariant.Create.Success'), variant });
  } catch (error) {
    console.error('Error creating product variant:', error);
    return res.status(500).json({
      message: getMessage('ProductVariant.Common.InternalServerError'),
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
      return res.status(404).json({ message: getMessage('ProductVariant.GetAll.Validation.ParentProductNotFound') });
    }

    const variants = await ProductVariant.getByProductId(Number(productId));
    return res.status(200).json({
      message: getMessage('ProductVariant.GetAll.Success'),
      product_id: Number(productId),
      variants,
    });
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return res.status(500).json({
      message: getMessage('ProductVariant.Common.InternalServerError'),
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
      return res.status(404).json({ message: getMessage('ProductVariant.GetById.Validation.ParentProductNotFound') });
    }

    const variant = await ProductVariant.getById(Number(variantId));
    if (!variant || Number(variant.product_id) !== Number(productId)) {
      return res.status(404).json({ message: getMessage('ProductVariant.GetById.Validation.VariantNotFoundForProduct') });
    }

    return res.status(200).json({
      message: getMessage('ProductVariant.GetById.Success'),
      variant,
    });
  } catch (error) {
    console.error('Error fetching product variant:', error);
    return res.status(500).json({
      message: getMessage('ProductVariant.Common.InternalServerError'),
      error: error.message,
    });
  }
};

// Update a variant for a specific product
export const updateProductVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const payload = normalizeVariantPayload(req.body || {});

    const uploadedPath = getUploadedSingleImagePath(req, 'products/variants');
    if (uploadedPath) {
      payload.image_url = toPublicUrl(req, uploadedPath);
    }

    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: getMessage('ProductVariant.Update.Validation.ParentProductNotFound') });
    }

    const existing = await ProductVariant.getById(Number(variantId));
    if (!existing || Number(existing.product_id) !== Number(productId)) {
      return res.status(404).json({ message: getMessage('ProductVariant.Update.Validation.VariantNotFoundForProduct') });
    }

    const updated = await ProductVariant.update(Number(variantId), payload);

    return res.status(200).json({
      message: getMessage('ProductVariant.Update.Success'),
      variant: updated,
    });
  } catch (error) {
    console.error('Error updating product variant:', error);
    return res.status(500).json({
      message: getMessage('ProductVariant.Common.InternalServerError'),
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
      return res.status(404).json({ message: getMessage('ProductVariant.Delete.Validation.ParentProductNotFound') });
    }

    const existing = await ProductVariant.getById(Number(variantId));
    if (!existing || Number(existing.product_id) !== Number(productId)) {
      return res.status(404).json({ message: getMessage('ProductVariant.Delete.Validation.VariantNotFoundForProduct') });
    }

    const deleted = await ProductVariant.delete(Number(variantId));

    return res.status(200).json({
      message: getMessage('ProductVariant.Delete.Success'),
      variant: deleted,
    });
  } catch (error) {
    console.error('Error deleting product variant:', error);
    return res.status(500).json({
      message: getMessage('ProductVariant.Common.InternalServerError'),
      error: error.message,
    });
  }
};
