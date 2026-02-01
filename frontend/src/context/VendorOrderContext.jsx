import React, { useState, useEffect } from "react";
import { VendorOrderContext } from "./VendorOrderContextObject";
import { orderAPI } from "../services/api";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";

export const VendorOrderProvider = ({ children }) => {
  const { vendor } = useVendorAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendor?.vendor_id) {
      setOrders([]);
      return;
    }

    const fetchVendorOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderAPI.getByVendor(vendor.vendor_id);
        setOrders(response.orders || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching vendor orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, [vendor?.vendor_id]);

  const updateOrderStatus = async (orderId, order_status) => {
    try {
      const response = await orderAPI.updateStatus(orderId, order_status);
      setOrders(
        orders.map((order) =>
          order.order_id === orderId ? { ...order, order_status } : order,
        ),
      );
      return { success: true, order: response.order };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePaymentStatus = async (orderId, payment_status) => {
    try {
      const response = await orderAPI.updatePaymentStatus(
        orderId,
        payment_status,
      );
      setOrders(
        orders.map((order) =>
          order.order_id === orderId ? { ...order, payment_status } : order,
        ),
      );
      return { success: true, order: response.order };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const refreshOrders = async () => {
    if (!vendor?.vendor_id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await orderAPI.getByVendor(vendor.vendor_id);
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message);
      console.error("Error refreshing vendor orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorOrderContext.Provider
      value={{
        orders,
        loading,
        error,
        updateOrderStatus,
        updatePaymentStatus,
        refreshOrders,
      }}
    >
      {children}
    </VendorOrderContext.Provider>
  );
};
