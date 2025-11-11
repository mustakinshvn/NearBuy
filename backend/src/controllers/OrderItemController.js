import OrderItem from "../models/OrderItem.js";

// Add item to order
export const addOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, unit_price, discount_price, product_title, product_image } = req.body;

    // Validation
    if (!order_id || !product_id || !quantity || !unit_price) {
      return res.status(400).json({ message: "order_id, product_id, quantity, and unit_price are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity must be greater than 0" });
    }

    // Create order item
    const orderItem = await OrderItem.create({
      order_id,
      product_id,
      quantity,
      unit_price,
      discount_price: discount_price || null,
      product_title: product_title || null,
      product_image: product_image || null,
    });

    res.status(201).json({
      message: "Order item added successfully",
      order_item: orderItem,
    });
  } catch (error) {
    console.error("Add order item error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.getAll();
    res.status(200).json({
      message: "Order items retrieved successfully",
      count: orderItems.length,
      order_items: orderItems,
    });
  } catch (error) {
    console.error("Get all order items error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const orderItem = await OrderItem.getById(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json({
      message: "Order item retrieved successfully",
      order_item: orderItem,
    });
  } catch (error) {
    console.error("Get order item by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get order items by order ID
export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderItems = await OrderItem.getByOrderId(orderId);

    res.status(200).json({
      message: "Order items retrieved successfully",
      count: orderItems.length,
      order_items: orderItems,
    });
  } catch (error) {
    console.error("Get order items by order ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get order items by product ID
export const getOrderItemsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const orderItems = await OrderItem.getByProductId(productId);

    res.status(200).json({
      message: "Order items retrieved successfully",
      count: orderItems.length,
      order_items: orderItems,
    });
  } catch (error) {
    console.error("Get order items by product ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update order item
export const updateOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { quantity, unit_price, discount_price } = req.body;

    if (!quantity || !unit_price) {
      return res.status(400).json({ message: "quantity and unit_price are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity must be greater than 0" });
    }

    const orderItem = await OrderItem.update(orderItemId, {
      quantity,
      unit_price,
      discount_price: discount_price || null,
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json({
      message: "Order item updated successfully",
      order_item: orderItem,
    });
  } catch (error) {
    console.error("Update order item error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete order item
export const deleteOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const deletedOrderItem = await OrderItem.delete(orderItemId);
    if (!deletedOrderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json({
      message: "Order item deleted successfully",
      order_item_id: deletedOrderItem.order_item_id,
    });
  } catch (error) {
    console.error("Delete order item error:", error);
    res.status(500).json({ message: error.message });
  }
};
