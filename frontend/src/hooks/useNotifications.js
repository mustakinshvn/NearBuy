import { useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from './useAuth';
import { useVendorAuthContext } from './useVendorAuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const { vendor } = useVendorAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emitNotificationsUpdated = () => {
    window.dispatchEvent(new CustomEvent('notifications:updated'));
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (user?.customer_id) {
        response = await notificationAPI.getByCustomer(user.customer_id);
      } else if (vendor?.vendor_id) {
        response = await notificationAPI.getByVendor(vendor.vendor_id);
      } else {
        setNotifications([]);
        setLoading(false);
        return;
      }

      setNotifications(response.notifications || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.customer_id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
      emitNotificationsUpdated();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const markAsUnread = async (notificationId) => {
    try {
      await notificationAPI.markAsUnread(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: false, read_at: null }
            : notification,
        ),
      );
      emitNotificationsUpdated();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const markAllAsRead = async () => {
    try {
      if (user?.customer_id) {
        await notificationAPI.markAllAsRead(user.customer_id);
      } else if (vendor?.vendor_id) {
        await notificationAPI.markAllAsReadVendor(vendor.vendor_id);
      }
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({ ...notification, is_read: true })),
      );
      emitNotificationsUpdated();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.filter((notification) => notification.notification_id !== notificationId),
      );
      emitNotificationsUpdated();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAsUnread,
    markAllAsRead, 
    deleteNotification,
    unreadCount,
    refetch: fetchNotifications
  };
};
