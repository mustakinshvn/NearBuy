import pool from '../config/db.js';
import Admin from './Admin.js';

/**
 * Product model
 *
 * Represents rows in the products table.
 *
 * NOTE ABOUT VARIANTS
 * --------------------
 * Products can optionally have one or more rows in the product_variants table.
 * Methods that return products (getById, getAll, searchByTitle, getBySeller)
 * now also include a `variants` array aggregated from product_variants.
 */
class Product {
    static async getDefaultPageSize() {
        return Admin.getSettingInt('products_page_size', 12);
    }

    static normalizePaginationInput({ limit, offset, page } = {}) {
        const resolvedLimit = Number.parseInt(limit, 10);
        const safeLimit = Number.isFinite(resolvedLimit) && resolvedLimit > 0
            ? resolvedLimit
            : null;

        const resolvedPage = Number.parseInt(page, 10);
        const safePage = Number.isFinite(resolvedPage) && resolvedPage > 0 ? resolvedPage : null;

        const resolvedOffset = Number.parseInt(offset, 10);
        const safeOffset = Number.isFinite(resolvedOffset) && resolvedOffset >= 0 ? resolvedOffset : null;

        return { limit: safeLimit, offset: safeOffset, page: safePage };
    }

    static async resolveLimit(limit) {
        const parsedLimit = Number.parseInt(limit, 10);
        if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
            return parsedLimit;
        }

        return Product.getDefaultPageSize();
    }

    static buildPaginationResult(rows, limit, offset) {
        const totalItems = Number(rows[0]?.total_count || 0);
        const products = rows.map(({ total_count, ...product }) => product);
        const totalPages = limit > 0 ? Math.max(1, Math.ceil(totalItems / limit)) : 1;
        const page = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

        return {
            products,
            pagination: {
                totalItems,
                totalPages,
                page,
                limit,
                offset,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }

    /**
     * Create a new product (base-level data only).
     *
     * Variant records, if any, should be created separately using the
     * ProductVariant model or dedicated controller endpoints.
     */
    static async create(data) {
        try {
            const {
                title,
                description = null,
                brand = null,
                model_number = null,
                category_id = null,
                subcategory_id = null,
                price,
                discount_price = null,
                currency = 'BDT',
                stock_quantity = 0,
                is_available = true,
                main_image_url = null,
                image_urls = null,
                average_rating = 0.0,
                total_reviews = 0,
                weight = null,
                dimensions = null,
                color = null,
                material = null,
                seller_id = null,
                keywords = null
            } = data;

            const query = `
            INSERT INTO products
            (title, description, brand, model_number, category_id, subcategory_id, price, discount_price, currency, stock_quantity, is_available, main_image_url, image_urls, average_rating, total_reviews, weight, dimensions, color, material, seller_id, keywords)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
            RETURNING *;
            `;

            const values = [
                title,
                description,
                brand,
                model_number,
                category_id,
                subcategory_id,
                price,
                discount_price,
                currency,
                stock_quantity,
                is_available,
                main_image_url,
                image_urls,
                average_rating,
                total_reviews,
                weight,
                dimensions,
                color,
                material,
                seller_id,
                keywords
            ];

            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    /**
     * Fetch a single product by ID, including its variants array.
     */
    static async getById(productId) {
        try {
            const query = `
                SELECT
                    p.*,
                    COALESCE(
                        json_agg(v.*) FILTER (WHERE v.variant_id IS NOT NULL),
                        '[]'::json
                    ) AS variants
                FROM products p
                LEFT JOIN product_variants v ON v.product_id = p.product_id
                WHERE p.product_id = $1
                GROUP BY p.product_id
            `;

            const { rows } = await pool.query(query, [productId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching product by ID: ${error.message}`);
        }
    }

    /**
     * Fetch a paginated list of products, each with a variants array.
     */
    static async getAll({ limit = 100, offset = 0 } = {}) {
        try {
            const safeLimit = await Product.resolveLimit(limit);
            const safeOffset = Number.isFinite(Number(offset)) && Number(offset) >= 0 ? Number(offset) : 0;
            const query = `
                WITH grouped_products AS (
                    SELECT
                        p.*,
                        COALESCE(
                            json_agg(v.*) FILTER (WHERE v.variant_id IS NOT NULL),
                            '[]'::json
                        ) AS variants
                    FROM products p
                    LEFT JOIN product_variants v ON v.product_id = p.product_id
                    GROUP BY p.product_id
                )
                SELECT *, COUNT(*) OVER() AS total_count
                FROM grouped_products
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
            `;

            const { rows } = await pool.query(query, [safeLimit, safeOffset]);
            return Product.buildPaginationResult(rows, safeLimit, safeOffset);
        } catch (error) {
            throw new Error(`Error fetching all products: ${error.message}`);
        }
    }

    /**
     * Search products by title (ILIKE), including variants array.
     */
    static async searchByTitle(title, { limit = 100, offset = 0 } = {}) {
        try {
            const safeLimit = await Product.resolveLimit(limit);
            const safeOffset = Number.isFinite(Number(offset)) && Number(offset) >= 0 ? Number(offset) : 0;
            const query = `
                WITH grouped_products AS (
                    SELECT
                        p.*,
                        COALESCE(
                            json_agg(v.*) FILTER (WHERE v.variant_id IS NOT NULL),
                            '[]'::json
                        ) AS variants
                    FROM products p
                    LEFT JOIN product_variants v ON v.product_id = p.product_id
                    WHERE p.title ILIKE $1
                    GROUP BY p.product_id
                )
                SELECT *, COUNT(*) OVER() AS total_count
                FROM grouped_products
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            `;

            const titleParam = `%${title}%`;
            const { rows } = await pool.query(query, [titleParam, safeLimit, safeOffset]);
            return Product.buildPaginationResult(rows, safeLimit, safeOffset);
        } catch (error) {
            throw new Error(`Error searching products by title: ${error.message}`);
        }
    }

    /**
     * Fetch all products for a given seller, including variants array.
     */
    static async getBySeller(sellerId, { limit = 100, offset = 0 } = {}) {
        try {
            const safeLimit = await Product.resolveLimit(limit);
            const safeOffset = Number.isFinite(Number(offset)) && Number(offset) >= 0 ? Number(offset) : 0;
            const query = `
                WITH grouped_products AS (
                    SELECT
                        p.*,
                        COALESCE(
                            json_agg(v.*) FILTER (WHERE v.variant_id IS NOT NULL),
                            '[]'::json
                        ) AS variants
                    FROM products p
                    LEFT JOIN product_variants v ON v.product_id = p.product_id
                    WHERE p.seller_id = $1
                    GROUP BY p.product_id
                )
                SELECT *, COUNT(*) OVER() AS total_count
                FROM grouped_products
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            `;

            const { rows } = await pool.query(query, [sellerId, safeLimit, safeOffset]);
            return Product.buildPaginationResult(rows, safeLimit, safeOffset);
        } catch (error) {
            throw new Error(`Error fetching products by seller: ${error.message}`);
        }
    }

    static async update(productId, data) {
        try {
            const allowed = [
                'title','description','brand','model_number','category_id','subcategory_id','price','discount_price','currency','stock_quantity','is_available','main_image_url','image_urls','average_rating','total_reviews','weight','dimensions','color','material','seller_id','keywords'
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
                return await Product.getById(productId);
            }

            setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

            const query = `
            UPDATE products
            SET ${setClauses.join(', ')}
            WHERE product_id = $${idx}
            RETURNING *;
            `;

            values.push(productId);

            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    static async reduceStock(productId, quantityToReduce) {
        try {
            const product = await Product.getById(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            if (product.stock_quantity < quantityToReduce) {
                throw new Error(`Insufficient stock. Available: ${product.stock_quantity}, Requested: ${quantityToReduce}`);
            }

            // Reduce stock quantity
            const query = `
            UPDATE products
            SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP
            WHERE product_id = $2
            RETURNING *;
            `;

            const { rows } = await pool.query(query, [quantityToReduce, productId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error reducing product stock: ${error.message}`);
        }
    }

    static async delete(productId) {
        try {
            const query = `DELETE FROM products WHERE product_id = $1 RETURNING *;`;
            const { rows } = await pool.query(query, [productId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}

export default Product;
