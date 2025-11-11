import pool from '../config/db.js';
import Product from './Product.js';

class Order {
  // Create a new order
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

  // Get all orders
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

  // Get order by ID
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

  // Get orders by customer ID
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

  // Get orders by vendor ID
  static async getByVendorId(vendorId) {
    try {
      const result = await pool.query(
        `SELECT order_id, customer_id, vendor_id, total_amount, discount_amount, final_amount, payment_method, payment_status, order_status, created_at, updated_at 
         FROM orders 
         WHERE vendor_id = $1 
         ORDER BY created_at DESC`,
        [vendorId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching orders by vendor: ${error.message}`);
    }
  }

  // Get past orders by customer (delivered orders)
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

  // Get all past orders (delivered orders) with pagination
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

  // Update order status
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
      
      // If order status is set to 'Confirmed', reduce product stock
      if (orderStatus === 'Confirmed') {
        try {
          // Get order items for this order
          const itemsResult = await pool.query(
            `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
            [orderId]
          );
          
          const items = itemsResult.rows;
          
          // Reduce stock for each product
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

  // Update payment status
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

  // Delete order
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
