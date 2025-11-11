import pool from '../config/db.js';

class OrderItem {
  // Create a new order item
  static async create(data) {
    const { order_id, product_id, quantity, unit_price, discount_price, product_title, product_image } = data;
    try {
      const result = await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount_price, product_title, product_image) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING order_item_id, order_id, product_id, quantity, unit_price, discount_price, total_price, product_title, product_image`,
        [order_id, product_id, quantity, unit_price, discount_price, product_title, product_image]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating order item: ${error.message}`);
    }
  }

  // Get all order items
  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT order_item_id, order_id, product_id, quantity, unit_price, discount_price, total_price, product_title, product_image 
         FROM order_items 
         ORDER BY order_item_id DESC`
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching order items: ${error.message}`);
    }
  }

  // Get order item by ID
  static async getById(orderItemId) {
    try {
      const result = await pool.query(
        `SELECT order_item_id, order_id, product_id, quantity, unit_price, discount_price, total_price, product_title, product_image 
         FROM order_items 
         WHERE order_item_id = $1`,
        [orderItemId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching order item: ${error.message}`);
    }
  }

  // Get order items by order ID
  static async getByOrderId(orderId) {
    try {
      const result = await pool.query(
        `SELECT order_item_id, order_id, product_id, quantity, unit_price, discount_price, total_price, product_title, product_image 
         FROM order_items 
         WHERE order_id = $1 
         ORDER BY order_item_id ASC`,
        [orderId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching order items by order: ${error.message}`);
    }
  }

  // Get order items by product ID
  static async getByProductId(productId) {
    try {
      const result = await pool.query(
        `SELECT order_item_id, order_id, product_id, quantity, unit_price, discount_price, total_price, product_title, product_image 
         FROM order_items 
         WHERE product_id = $1 
         ORDER BY order_item_id DESC`,
        [productId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching order items by product: ${error.message}`);
    }
  }

  // Update order item
  static async update(orderItemId, data) {
    const { quantity, unit_price, discount_price } = data;
    try {
      const result = await pool.query(
        `UPDATE order_items 
         SET quantity = $1, unit_price = $2, discount_price = $3 
         WHERE order_item_id = $4 
         RETURNING order_item_id, order_id, product_id, quantity, unit_price, discount_price, total_price, product_title, product_image`,
        [quantity, unit_price, discount_price, orderItemId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating order item: ${error.message}`);
    }
  }

  // Delete order item
  static async delete(orderItemId) {
    try {
      const result = await pool.query(
        `DELETE FROM order_items WHERE order_item_id = $1 RETURNING order_item_id`,
        [orderItemId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting order item: ${error.message}`);
    }
  }

  // Delete all items for an order
  static async deleteByOrderId(orderId) {
    try {
      const result = await pool.query(
        `DELETE FROM order_items WHERE order_id = $1 RETURNING order_item_id`,
        [orderId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error deleting order items: ${error.message}`);
    }
  }
}

export default OrderItem;
