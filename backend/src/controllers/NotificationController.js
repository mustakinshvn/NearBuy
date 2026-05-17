import Notification from '../models/Notification.js';
import { getMessage } from '../resources/messages.js';

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
      return res.status(400).json({ message: getMessage('Notification.Create.Validation.TitleAndMessageRequired') });
    }

    // At least one recipient (customer_id or vendor_id) should be provided
    if (!customer_id && !vendor_id) {
      return res.status(400).json({ message: getMessage('Notification.Create.Validation.RecipientRequired') });
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
      message: getMessage('Notification.Create.Success'),
      notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAll();
    res.status(200).json({
      message: getMessage('Notification.GetAll.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.getById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: getMessage('Notification.GetById.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Notification.GetById.Success'),
      notification,
    });
  } catch (error) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const notifications = await Notification.getByCustomerId(customerId);
    res.status(200).json({
      message: getMessage('Notification.GetByCustomer.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by customer error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const notifications = await Notification.getByVendorId(vendorId);
    res.status(200).json({
      message: getMessage('Notification.GetByVendor.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by vendor error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getUnreadByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const notifications = await Notification.getUnreadByCustomerId(customerId);
    res.status(200).json({
      message: getMessage('Notification.GetUnreadByCustomer.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get unread notifications by customer error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getUnreadByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const notifications = await Notification.getUnreadByVendorId(vendorId);
    res.status(200).json({
      message: getMessage('Notification.GetUnreadByVendor.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get unread notifications by vendor error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const notifications = await Notification.getByType(type);
    res.status(200).json({
      message: getMessage('Notification.GetByType.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by type error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;

    const notifications = await Notification.getByPriority(priority);
    res.status(200).json({
      message: getMessage('Notification.GetByPriority.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by priority error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.markAsRead(notificationId);
    if (!notification) {
      return res.status(404).json({ message: getMessage('Notification.MarkAsRead.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Notification.MarkAsRead.Success'),
      notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const markAsUnread = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.markAsUnread(notificationId);
    if (!notification) {
      return res.status(404).json({ message: getMessage('Notification.MarkAsUnread.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Notification.MarkAsUnread.Success'),
      notification,
    });
  } catch (error) {
    console.error('Mark as unread error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const markMultipleAsRead = async (req, res) => {
  try {
    const { notification_ids } = req.body;

    if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
      return res.status(400).json({ message: getMessage('Notification.MarkMultipleAsRead.Validation.NotificationIdsRequired') });
    }

    const notifications = await Notification.markMultipleAsRead(notification_ids);

    res.status(200).json({
      message: getMessage('Notification.MarkMultipleAsRead.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Mark multiple as read error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.delete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: getMessage('Notification.Delete.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Notification.Delete.Success'),
      notification,
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const deleteMultipleNotifications = async (req, res) => {
  try {
    const { notification_ids } = req.body;

    if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
      return res.status(400).json({ message: getMessage('Notification.DeleteMultiple.Validation.NotificationIdsRequired') });
    }

    const notifications = await Notification.deleteMultiple(notification_ids);

    res.status(200).json({
      message: getMessage('Notification.DeleteMultiple.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Delete multiple notifications error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getUnreadCountByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await Notification.getUnreadCountByCustomerId(customerId);
    res.status(200).json({
      message: getMessage('Notification.GetUnreadCount.Success'),
      unread_count: parseInt(result.unread_count),
    });
  } catch (error) {
    console.error('Get unread count by customer error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getUnreadCountByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const result = await Notification.getUnreadCountByVendorId(vendorId);
    res.status(200).json({
      message: getMessage('Notification.GetUnreadCount.Success'),
      unread_count: parseInt(result.unread_count),
    });
  } catch (error) {
    console.error('Get unread count by vendor error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

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
      return res.status(404).json({ message: getMessage('Notification.Update.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Notification.Update.Success'),
      notification,
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const notifications = await Notification.getByOrderId(orderId);
    res.status(200).json({
      message: getMessage('Notification.GetByOrder.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by order error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};

export const getNotificationsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const notifications = await Notification.getByProductId(productId);
    res.status(200).json({
      message: getMessage('Notification.GetByProduct.Success'),
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications by product error:', error);
    res.status(500).json({ message: getMessage('Notification.Common.InternalServerError'), error: error.message });
  }
};
