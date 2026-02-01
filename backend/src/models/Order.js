import pool from '../config/db.js';
import Product from './Product.js';

class Order {
  static async create(data) {
    const { customer_id, vendor_id, total_amount, discount_amount, payment_method } = data;
    try {
      const result = await pool.query(
        `INSERT INTO orders (customer_id, vendor_id, total_amount, discount_amount, payment_method) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at`,
        [customer_id, vendor_id, total_amount, discount_amount, payment_method]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }
  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at 
         FROM orders 
         ORDER BY created_at DESC`
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  static async getById(orderId) {
    try {
      const result = await pool.query(
        `SELECT order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at 
         FROM orders 
         WHERE order_id = $1`,
        [orderId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  static async getByCustomerId(customerId) {
    try {
      const result = await pool.query(
        `SELECT order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at 
         FROM orders 
         WHERE customer_id = $1 
         ORDER BY created_at DESC`,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching orders by customer: ${error.message}`);
    }
  }

  static async getByVendorId(vendorId) {
    try {
      const result = await pool.query(
        `SELECT o.order_id, o.customer_id, o.vendor_id, o.total_amount, o.discount_amount, o.final_amount, o.payment_method, o.payment_status, o.order_status, o.created_at, o.updated_at,
        c.customer_id, c.name, c.email, c.phone,
        oi.order_item_id, oi.product_id, oi.quantity, oi.unit_price, oi.discount_price, oi.total_price, oi.product_title, oi.product_image
         FROM orders o
         JOIN customers c ON o.customer_id = c.customer_id
         JOIN order_items oi ON o.order_id = oi.order_id
         WHERE o.vendor_id = $1
         ORDER BY o.created_at DESC`,
        [vendorId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching orders by vendor: ${error.message}`);
    }
  }

  static async getPastOrdersByCustomerId(customerId) {
    try {
      const result = await pool.query(
        `SELECT order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at 
         FROM orders 
         WHERE customer_id = $1 AND order_status = 'Delivered' 
         ORDER BY created_at DESC`,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching past orders by customer: ${error.message}`);
    }
  }

  static async getAllPastOrders(limit = 50, offset = 0) {
    try {
      const result = await pool.query(
        `SELECT order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at 
         FROM orders 
         WHERE order_status = 'Delivered' 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching all past orders: ${error.message}`);
    }
  }

  static async updateOrderStatus(orderId, orderStatus) {
    try {
      const result = await pool.query(
        `UPDATE orders 
         SET order_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE order_id = $2 
         RETURNING order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at`,
        [orderStatus, orderId]
      );
      
      const order = result.rows[0];
      
      if (orderStatus === 'Confirmed') {
        try {
          const itemsResult = await pool.query(
            `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
            [orderId]
          );
          
          const items = itemsResult.rows;
          
          for (const item of items) {
            await Product.reduceStock(item.product_id, item.quantity);
          }
        } catch (error) {
          throw new Error(`Error reducing stock during order confirmation: ${error.message}`);
        }
      }
      
      return order;
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  static async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const result = await pool.query(
        `UPDATE orders 
         SET payment_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE order_id = $2 
         RETURNING order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at`,
        [paymentStatus, orderId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }

  static async delete(orderId) {
    try {
      const result = await pool.query(
        `DELETE FROM orders WHERE order_id = $1 RETURNING order_id`,
        [orderId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }
}

export default Order;
