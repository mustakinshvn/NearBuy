import Notification from '../models/Notification.js';

// Create a new notification
export const createNotification = async (req, res) => {
  try {
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
    } = req.body;

    // Validation - at least title and message are required
    if (!title || !message) {
      return res.status(400).json({ message: 'title and message are required' });
    }

    // At least one recipient (customer_id or vendor_id) should be provided
    if (!customer_id && !vendor_id) {
      return res.status(400).json({ message: 'At least customer_id or vendor_id is required' });
    }

    const notification = await Notification.create({
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
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAll();
    res.status(200).json({
      message: 'Notifications retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.getById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification retrieved successfully',
      notification,
    });
  } catch (error) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notifications by customer ID
export const getNotificationsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const notifications = await Notification.getByCustomerId(customerId);
    res.status(200).json({
      message: 'Customer notifications retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by customer error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notifications by vendor ID
export const getNotificationsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const notifications = await Notification.getByVendorId(vendorId);
    res.status(200).json({
      message: 'Vendor notifications retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by vendor error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get unread notifications by customer ID
export const getUnreadByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const notifications = await Notification.getUnreadByCustomerId(customerId);
    res.status(200).json({
      message: 'Unread customer notifications retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get unread notifications by customer error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get unread notifications by vendor ID
export const getUnreadByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const notifications = await Notification.getUnreadByVendorId(vendorId);
    res.status(200).json({
      message: 'Unread vendor notifications retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get unread notifications by vendor error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notifications by type
export const getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const notifications = await Notification.getByType(type);
    res.status(200).json({
      message: 'Notifications by type retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by type error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notifications by priority
export const getNotificationsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;

    const notifications = await Notification.getByPriority(priority);
    res.status(200).json({
      message: 'Notifications by priority retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by priority error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.markAsRead(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read successfully',
      notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark multiple notifications as read
export const markMultipleAsRead = async (req, res) => {
  try {
    const { notification_ids } = req.body;

    if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
      return res.status(400).json({ message: 'notification_ids array is required' });
    }

    const notifications = await Notification.markMultipleAsRead(notification_ids);

    res.status(200).json({
      message: 'Notifications marked as read successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Mark multiple as read error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete notification (soft delete)
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.delete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
      notification,
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete multiple notifications (soft delete)
export const deleteMultipleNotifications = async (req, res) => {
  try {
    const { notification_ids } = req.body;

    if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
      return res.status(400).json({ message: 'notification_ids array is required' });
    }

    const notifications = await Notification.deleteMultiple(notification_ids);

    res.status(200).json({
      message: 'Notifications deleted successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Delete multiple notifications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get unread count by customer ID
export const getUnreadCountByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await Notification.getUnreadCountByCustomerId(customerId);
    res.status(200).json({
      message: 'Unread notification count retrieved successfully',
      unread_count: parseInt(result.unread_count),
    });
  } catch (error) {
    console.error('Get unread count by customer error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get unread count by vendor ID
export const getUnreadCountByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const result = await Notification.getUnreadCountByVendorId(vendorId);
    res.status(200).json({
      message: 'Unread notification count retrieved successfully',
      unread_count: parseInt(result.unread_count),
    });
  } catch (error) {
    console.error('Get unread count by vendor error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update notification
export const updateNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { title, message, type, priority } = req.body;

    const notification = await Notification.update(notificationId, {
      title,
      message,
      type,
      priority,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification updated successfully',
      notification,
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notifications by order ID
export const getNotificationsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const notifications = await Notification.getByOrderId(orderId);
    res.status(200).json({
      message: 'Notifications by order ID retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notifications by product ID
export const getNotificationsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const notifications = await Notification.getByProductId(productId);
    res.status(200).json({
      message: 'Notifications by product ID retrieved successfully',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by product error:', error);
    res.status(500).json({ message: error.message });
  }
};
