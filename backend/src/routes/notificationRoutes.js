import express from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  getNotificationsByCustomer,
  getNotificationsByVendor,
  getUnreadByCustomer,
  getUnreadByVendor,
  getNotificationsByType,
  getNotificationsByPriority,
  markAsRead,
  markMultipleAsRead,
  deleteNotification,
  deleteMultipleNotifications,
  getUnreadCountByCustomer,
  getUnreadCountByVendor,
  updateNotification,
  getNotificationsByOrder,
  getNotificationsByProduct,
} from '../controllers/NotificationController.js';

import {
  validateNotificationCreate,
  validateNotificationId,
} from '../middleware/validation.js';

const router = express.Router();

// Create notification
router.post('/', validateNotificationCreate, createNotification);

// Get all notifications
router.get('/', getAllNotifications);

// Get notifications by type
router.get('/type/:type', getNotificationsByType);

// Get notifications by priority
router.get('/priority/:priority', getNotificationsByPriority);

// Get notifications by order ID
router.get('/order/:orderId', getNotificationsByOrder);

// Get notifications by product ID
router.get('/product/:productId', getNotificationsByProduct);

// Get notification by ID
router.get('/:notificationId', validateNotificationId, getNotificationById);

// Get notifications by customer
router.get('/customer/:customerId', getNotificationsByCustomer);

// Get unread notifications by customer
router.get('/customer/:customerId/unread', getUnreadByCustomer);

// Get unread count by customer
router.get('/customer/:customerId/unread-count', getUnreadCountByCustomer);

// Get notifications by vendor
router.get('/vendor/:vendorId', getNotificationsByVendor);

// Get unread notifications by vendor
router.get('/vendor/:vendorId/unread', getUnreadByVendor);

// Get unread count by vendor
router.get('/vendor/:vendorId/unread-count', getUnreadCountByVendor);

// Update notification
router.put('/:notificationId', validateNotificationId, updateNotification);

// Mark notification as read
router.put('/:notificationId/read', validateNotificationId, markAsRead);

// Mark multiple notifications as read
router.put('/read/multiple', markMultipleAsRead);

// Delete notification
router.delete('/:notificationId', validateNotificationId, deleteNotification);

// Delete multiple notifications
router.delete('/delete/multiple', deleteMultipleNotifications);

export default router;
