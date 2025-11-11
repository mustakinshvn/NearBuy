import pool from '../config/db.js';

class Notification {
  // Create a new notification
  static async create(data) {
    const {
      customer_id,
      vendor_id,
      order_id,
      product_id,
      review_id,
      coupon_id,
      admin_id,
      title,
      message,
      type,
      priority,
    } = data;

    try {
      const result = await pool.query(
        `INSERT INTO notifications (
          customer_id, vendor_id, order_id, product_id, 
          review_id, coupon_id, admin_id, title, message, type, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING notification_id, customer_id, vendor_id, order_id, 
                  product_id, review_id, coupon_id, admin_id, title, message, 
                  type, priority, is_read, is_deleted, sent_at, read_at`,
        [
          customer_id || null,
          vendor_id || null,
          order_id || null,
          product_id || null,
          review_id || null,
          coupon_id || null,
          admin_id || null,
          title,
          message,
          type || 'General',
          priority || 'Normal',
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }
  }

  // Get all notifications
  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE is_deleted = FALSE 
         ORDER BY sent_at DESC`
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching notifications: ${error.message}`);
    }
  }

  // Get notification by ID
  static async getById(notificationId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE notification_id = $1 AND is_deleted = FALSE`,
        [notificationId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching notification: ${error.message}`);
    }
  }

  // Get notifications for a customer
  static async getByCustomerId(customerId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE customer_id = $1 AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching customer notifications: ${error.message}`);
    }
  }

  // Get notifications for a vendor
  static async getByVendorId(vendorId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE vendor_id = $1 AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [vendorId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching vendor notifications: ${error.message}`);
    }
  }

  // Get unread notifications for a customer
  static async getUnreadByCustomerId(customerId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE customer_id = $1 AND is_read = FALSE AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching unread customer notifications: ${error.message}`);
    }
  }

  // Get unread notifications for a vendor
  static async getUnreadByVendorId(vendorId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE vendor_id = $1 AND is_read = FALSE AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [vendorId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching unread vendor notifications: ${error.message}`);
    }
  }

  // Get notifications by type
  static async getByType(type) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE type = $1 AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [type]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching notifications by type: ${error.message}`);
    }
  }

  // Get notifications by priority
  static async getByPriority(priority) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE priority = $1 AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [priority]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching notifications by priority: ${error.message}`);
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const result = await pool.query(
        `UPDATE notifications 
         SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
         WHERE notification_id = $1 
         RETURNING notification_id, customer_id, vendor_id, order_id, 
                   product_id, review_id, coupon_id, admin_id, title, message, 
                   type, priority, is_read, is_deleted, sent_at, read_at`,
        [notificationId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
  }

  // Mark multiple notifications as read
  static async markMultipleAsRead(notificationIds) {
    try {
      const result = await pool.query(
        `UPDATE notifications 
         SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
         WHERE notification_id = ANY($1::int[]) 
         RETURNING notification_id, customer_id, vendor_id, order_id, 
                   product_id, review_id, coupon_id, admin_id, title, message, 
                   type, priority, is_read, is_deleted, sent_at, read_at`,
        [notificationIds]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error marking multiple notifications as read: ${error.message}`);
    }
  }

  // Soft delete notification
  static async delete(notificationId) {
    try {
      const result = await pool.query(
        `UPDATE notifications 
         SET is_deleted = TRUE 
         WHERE notification_id = $1 
         RETURNING notification_id, customer_id, vendor_id, order_id, 
                   product_id, review_id, coupon_id, admin_id, title, message, 
                   type, priority, is_read, is_deleted, sent_at, read_at`,
        [notificationId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting notification: ${error.message}`);
    }
  }

  // Soft delete multiple notifications
  static async deleteMultiple(notificationIds) {
    try {
      const result = await pool.query(
        `UPDATE notifications 
         SET is_deleted = TRUE 
         WHERE notification_id = ANY($1::int[]) 
         RETURNING notification_id, customer_id, vendor_id, order_id, 
                   product_id, review_id, coupon_id, admin_id, title, message, 
                   type, priority, is_read, is_deleted, sent_at, read_at`,
        [notificationIds]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error deleting multiple notifications: ${error.message}`);
    }
  }

  // Get count of unread notifications for a customer
  static async getUnreadCountByCustomerId(customerId) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as unread_count 
         FROM notifications 
         WHERE customer_id = $1 AND is_read = FALSE AND is_deleted = FALSE`,
        [customerId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error counting unread customer notifications: ${error.message}`);
    }
  }

  // Get count of unread notifications for a vendor
  static async getUnreadCountByVendorId(vendorId) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as unread_count 
         FROM notifications 
         WHERE vendor_id = $1 AND is_read = FALSE AND is_deleted = FALSE`,
        [vendorId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error counting unread vendor notifications: ${error.message}`);
    }
  }

  // Update notification
  static async update(notificationId, data) {
    const { title, message, type, priority } = data;
    try {
      const result = await pool.query(
        `UPDATE notifications 
         SET title = COALESCE($1, title),
             message = COALESCE($2, message),
             type = COALESCE($3, type),
             priority = COALESCE($4, priority)
         WHERE notification_id = $5 
         RETURNING notification_id, customer_id, vendor_id, order_id, 
                   product_id, review_id, coupon_id, admin_id, title, message, 
                   type, priority, is_read, is_deleted, sent_at, read_at`,
        [title, message, type, priority, notificationId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating notification: ${error.message}`);
    }
  }

  // Get notifications by order ID
  static async getByOrderId(orderId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE order_id = $1 AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [orderId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching notifications by order ID: ${error.message}`);
    }
  }

  // Get notifications by product ID
  static async getByProductId(productId) {
    try {
      const result = await pool.query(
        `SELECT notification_id, customer_id, vendor_id, order_id, 
                product_id, review_id, coupon_id, admin_id, title, message, 
                type, priority, is_read, is_deleted, sent_at, read_at 
         FROM notifications 
         WHERE product_id = $1 AND is_deleted = FALSE 
         ORDER BY sent_at DESC`,
        [productId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching notifications by product ID: ${error.message}`);
    }
  }
}

export default Notification;
