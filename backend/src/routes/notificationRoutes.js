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
  markAsUnread,
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
import { ROUTES } from '../lib/ROUTES.js';

const router = express.Router();

router.post(ROUTES.NOTIFICATIONS.BASE, validateNotificationCreate, createNotification);

router.get(ROUTES.NOTIFICATIONS.BASE, getAllNotifications);

router.get(ROUTES.NOTIFICATIONS.TYPE, getNotificationsByType);

router.get(ROUTES.NOTIFICATIONS.PRIORITY, getNotificationsByPriority);

router.get(ROUTES.NOTIFICATIONS.ORDER, getNotificationsByOrder);

router.get(ROUTES.NOTIFICATIONS.PRODUCT, getNotificationsByProduct);

router.get(ROUTES.NOTIFICATIONS.BY_ID, validateNotificationId, getNotificationById);

router.get(ROUTES.NOTIFICATIONS.CUSTOMER, getNotificationsByCustomer);

router.get(ROUTES.NOTIFICATIONS.CUSTOMER_UNREAD, getUnreadByCustomer);

router.get(ROUTES.NOTIFICATIONS.CUSTOMER_UNREAD_COUNT, getUnreadCountByCustomer);

router.get(ROUTES.NOTIFICATIONS.VENDOR, getNotificationsByVendor);

router.get(ROUTES.NOTIFICATIONS.VENDOR_UNREAD, getUnreadByVendor);

router.get(ROUTES.NOTIFICATIONS.VENDOR_UNREAD_COUNT, getUnreadCountByVendor);

router.put(ROUTES.NOTIFICATIONS.BY_ID, validateNotificationId, updateNotification);

router.put(ROUTES.NOTIFICATIONS.BY_ID.replace(':notificationId', ':notificationId/read'), validateNotificationId, markAsRead);

router.put(ROUTES.NOTIFICATIONS.BY_ID.replace(':notificationId', ':notificationId/unread'), validateNotificationId, markAsUnread);

router.put(ROUTES.NOTIFICATIONS.READ_MULTIPLE, markMultipleAsRead);

router.delete(ROUTES.NOTIFICATIONS.BY_ID, validateNotificationId, deleteNotification);

router.delete(ROUTES.NOTIFICATIONS.DELETE_MULTIPLE, deleteMultipleNotifications);

export default router;
