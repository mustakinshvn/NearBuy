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
      setNotifications(notifications.map(n => 
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      ));
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
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications(notifications.filter(n => n.notification_id !== notificationId));
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
    markAllAsRead, 
    deleteNotification,
    unreadCount,
    refetch: fetchNotifications
  };
};
