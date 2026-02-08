import pool from '../config/db.js';

/**
 * ProductVariant model
 *
 * Represents a single variant row in the product_variants table.
 * Variant-level attributes can optionally override product-level defaults
 * (price, discount_price, stock_quantity, image, weight, dimensions, etc.).
 */
class ProductVariant {
  /**
   * Create a new product variant for a given product.
   *
   * @param {Object} data - Variant payload
   * @param {number} data.product_id - Parent product ID (required)
   * @param {string} [data.sku]
   * @param {string} [data.variant_name]
   * @param {string} [data.color]
   * @param {string} [data.size]
   * @param {string} [data.material]
   * @param {number} [data.price]
   * @param {number} [data.discount_price]
   * @param {number} [data.stock_quantity]
   * @param {boolean} [data.is_available]
   * @param {string} [data.image_url]
   * @param {number} [data.weight]
   * @param {string} [data.dimensions]
   * @returns {Promise<Object>} Inserted variant row
   */
  static async create(data) {
    const {
      product_id,
      sku = null,
      variant_name = null,
      color = null,
      size = null,
      material = null,
      price = null,
      discount_price = null,
      stock_quantity = 0,
      is_available = true,
      image_url = null,
      weight = null,
      dimensions = null,
    } = data;

    if (!product_id) {
      throw new Error('product_id is required to create a product variant');
    }

    try {
      const query = `
        INSERT INTO product_variants
          (product_id, sku, variant_name, color, size, material, price, discount_price, stock_quantity, is_available, image_url, weight, dimensions)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
      `;

      const values = [
        product_id,
        sku,
        variant_name,
        color,
        size,
        material,
        price,
        discount_price,
        stock_quantity,
        is_available,
        image_url,
        weight,
        dimensions,
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating product variant: ${error.message}`);
    }
  }

  /**
   * Fetch a variant by its primary key.
   * @param {number} variantId
   * @returns {Promise<Object|null>}
   */
  static async getById(variantId) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM product_variants WHERE variant_id = $1',
        [variantId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching product variant by ID: ${error.message}`);
    }
  }

  /**
   * Fetch all variants for a given product.
   * @param {number} productId
   * @returns {Promise<Array<Object>>}
   */
  static async getByProductId(productId) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM product_variants
         WHERE product_id = $1
         ORDER BY created_at ASC`,
        [productId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching product variants by product: ${error.message}`);
    }
  }

  /**
   * Update a variant. Only allowed fields provided in `data` will be updated.
   * @param {number} variantId
   * @param {Object} data
   * @returns {Promise<Object|null>} Updated variant or null if not found
   */
  static async update(variantId, data) {
    try {
      const allowed = [
        'sku',
        'variant_name',
        'color',
        'size',
        'material',
        'price',
        'discount_price',
        'stock_quantity',
        'is_available',
        'image_url',
        'weight',
        'dimensions',
      ];

      const setClauses = [];
      const values = [];
      let idx = 1;

      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          setClauses.push(`${key} = $${idx}`);
          values.push(data[key]);
          idx++;
        }
      }

      if (setClauses.length === 0) {
        return await ProductVariant.getById(variantId);
      }

      setClauses.push('updated_at = CURRENT_TIMESTAMP');

      const query = `
        UPDATE product_variants
        SET ${setClauses.join(', ')}
        WHERE variant_id = $${idx}
        RETURNING *;
      `;

      values.push(variantId);

      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error updating product variant: ${error.message}`);
    }
  }

  /**
   * Delete a variant by ID.
   * @param {number} variantId
   * @returns {Promise<Object|null>} Deleted row (or null if not found)
   */
  static async delete(variantId) {
    try {
      const { rows } = await pool.query(
        'DELETE FROM product_variants WHERE variant_id = $1 RETURNING *;',
        [variantId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error deleting product variant: ${error.message}`);
    }
  }

  /**
   * Reduce stock for a specific variant when an order is confirmed.
   * Does not allow stock to go negative.
   * @param {number} variantId
   * @param {number} quantityToReduce
   * @returns {Promise<Object>} Updated variant row
   */
  static async reduceStock(variantId, quantityToReduce) {
    try {
      const variant = await ProductVariant.getById(variantId);
      if (!variant) {
        throw new Error(`Variant with ID ${variantId} not found`);
      }

      if (variant.stock_quantity < quantityToReduce) {
        throw new Error(
          `Insufficient variant stock. Available: ${variant.stock_quantity}, Requested: ${quantityToReduce}`
        );
      }

      const query = `
        UPDATE product_variants
        SET stock_quantity = stock_quantity - $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE variant_id = $2
        RETURNING *;
      `;

      const { rows } = await pool.query(query, [quantityToReduce, variantId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error reducing product variant stock: ${error.message}`);
    }
  }
}

export default ProductVariant;
