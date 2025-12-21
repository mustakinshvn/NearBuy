import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.customer_id) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderAPI.getByCustomer(user.customer_id);
        setOrders(response.orders || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.customer_id]);

  const createOrder = async (orderData) => {
    try {
      const response = await orderAPI.create(orderData);
      setOrders([...orders, response.order]);
      return { success: true, order: response.order };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { orders, loading, error, createOrder };
};
