import { useState, useEffect } from 'react';
import { orderItemAPI } from '../services/api';

export const useOrderItems = (orderId = null) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderItemAPI.getByOrderId(orderId);
        setOrderItems(response.order_items || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching order items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId]);

  const getOrderItemById = async (orderItemId) => {
    try {
      const response = await orderItemAPI.getById(orderItemId);
      return { success: true, orderItem: response.order_item };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getOrderItemsByOrderId = async (orderId) => {
    try {
      const response = await orderItemAPI.getByOrderId(orderId);
      return { success: true, orderItems: response.order_items };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getOrderItemsByProductId = async (productId) => {
    try {
      const response = await orderItemAPI.getByProductId(productId);
      return { success: true, orderItems: response.order_items };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const createOrderItem = async (orderItemData) => {
    try {
      const response = await orderItemAPI.create(orderItemData);
      setOrderItems([...orderItems, response.order_item]);
      return { success: true, orderItem: response.order_item };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateOrderItem = async (orderItemId, updateData) => {
    try {
      const response = await orderItemAPI.update(orderItemId, updateData);
      setOrderItems(orderItems.map(item => 
        item.order_item_id === orderItemId ? response.order_item : item
      ));
      return { success: true, orderItem: response.order_item };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteOrderItem = async (orderItemId) => {
    try {
      await orderItemAPI.delete(orderItemId);
      setOrderItems(orderItems.filter(item => item.order_item_id !== orderItemId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    orderItems,
    loading,
    error,
    getOrderItemById,
    getOrderItemsByOrderId,
    getOrderItemsByProductId,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem,
  };
};
