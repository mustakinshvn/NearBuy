import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { customer_id, vendor_id, total_amount, discount_amount, payment_method, items } = req.body;

    // Validation
    if (!customer_id || !total_amount || !items || items.length === 0) {
      return res.status(400).json({ message: "customer_id, total_amount, and items are required" });
    }

    // Create order
    const order = await Order.create({
      customer_id,
      vendor_id,
      total_amount,
      discount_amount: discount_amount || 0,
      payment_method: payment_method || 'Cash on Delivery',
    });

    // Create order items
    const orderItemsData = [];
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        return res.status(400).json({ message: "Each item must have product_id, quantity, and unit_price" });
      }

      const orderItem = await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_price: item.discount_price || null,
        product_title: item.product_title || null,
        product_image: item.product_image || null,
      });

      orderItemsData.push(orderItem);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        order_id: order.order_id,
        customer_id: order.customer_id,
        vendor_id: order.vendor_id,
        total_amount: order.total_amount,
        discount_amount: order.discount_amount,
        final_amount: order.final_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        created_at: order.created_at,
      },
      items: orderItemsData,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID with items
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await OrderItem.getByOrderId(orderId);

    res.status(200).json({
      message: "Order retrieved successfully",
      order: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders by customer ID
export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.getByCustomerId(customerId);

    res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders by customer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders by vendor ID
export const getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const orders = await Order.getByVendorId(vendorId);

    res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders by vendor error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({ message: "order_status is required" });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.updateOrderStatus(orderId, order_status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({ message: "payment_status is required" });
    }

    const validStatuses = ['Pending', 'Paid', 'Refunded'];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.updatePaymentStatus(orderId, payment_status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get past orders by customer (delivered orders)
export const getPastOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.getPastOrdersByCustomerId(customerId);

    res.status(200).json({
      message: "Past orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get past orders by customer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all past orders (delivered orders) with pagination
export const getAllPastOrders = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Validate pagination parameters
    const validLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
    const validOffset = Math.max(parseInt(offset) || 0, 0);

    const orders = await Order.getAllPastOrders(validLimit, validOffset);

    res.status(200).json({
      message: "All past orders retrieved successfully",
      count: orders.length,
      limit: validLimit,
      offset: validOffset,
      orders,
    });
  } catch (error) {
    console.error("Get all past orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Delete associated order items first
    await OrderItem.deleteByOrderId(orderId);

    // Delete the order
    const deletedOrder = await Order.delete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order_id: deletedOrder.order_id,
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: error.message });
  }
};
