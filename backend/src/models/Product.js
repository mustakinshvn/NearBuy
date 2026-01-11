import pool from '../config/db.js';

class Product {
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

    static async getById(productId) {
        try {
            const query = `SELECT * FROM products WHERE product_id = $1`;
            const { rows } = await pool.query(query, [productId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching product by ID: ${error.message}`);
        }
    }

    static async getAll({ limit = 100, offset = 0 } = {}) {
        try {
            const query = `SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
            const { rows } = await pool.query(query, [limit, offset]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all products: ${error.message}`);
        }
    }

    static async searchByTitle(title, { limit = 100, offset = 0 } = {}) {
        try {
            const query = `SELECT * FROM products WHERE title ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
            const titleParam = `%${title}%`;
            const { rows } = await pool.query(query, [titleParam, limit, offset]);
            return rows;
        } catch (error) {
            throw new Error(`Error searching products by title: ${error.message}`);
        }
    }

    static async getBySeller(sellerId) {
        try {
            const query = `SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC`;
            const { rows } = await pool.query(query, [sellerId]);
            return rows;
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
