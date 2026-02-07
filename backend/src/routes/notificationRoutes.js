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

router.post('/', validateNotificationCreate, createNotification);

router.get('/', getAllNotifications);

router.get('/type/:type', getNotificationsByType);

router.get('/priority/:priority', getNotificationsByPriority);

router.get('/order/:orderId', getNotificationsByOrder);

router.get('/product/:productId', getNotificationsByProduct);

router.get('/:notificationId', validateNotificationId, getNotificationById);

router.get('/customer/:customerId', getNotificationsByCustomer);

router.get('/customer/:customerId/unread', getUnreadByCustomer);

router.get('/customer/:customerId/unread-count', getUnreadCountByCustomer);

router.get('/vendor/:vendorId', getNotificationsByVendor);

router.get('/vendor/:vendorId/unread', getUnreadByVendor);

router.get('/vendor/:vendorId/unread-count', getUnreadCountByVendor);

router.put('/:notificationId', validateNotificationId, updateNotification);

router.put('/:notificationId/read', validateNotificationId, markAsRead);

router.put('/read/multiple', markMultipleAsRead);

router.delete('/:notificationId', validateNotificationId, deleteNotification);

router.delete('/delete/multiple', deleteMultipleNotifications);

export default router;
