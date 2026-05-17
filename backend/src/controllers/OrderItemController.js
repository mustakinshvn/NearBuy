import OrderItem from "../models/OrderItem.js";
import { getMessage } from '../resources/messages.js';

// Add item to order
export const addOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, unit_price, discount_price, product_title, product_image } = req.body;

    // Validation
    if (!order_id || !product_id || !quantity || !unit_price) {
      return res.status(400).json({ message: getMessage('OrderItem.Create.Validation.RequiredFields') });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: getMessage('OrderItem.Create.Validation.QuantityGreaterThanZero') });
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
      message: getMessage('OrderItem.Create.Success'),
      order_item: orderItem,
    });
  } catch (error) {
    console.error("Add order item error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};

// Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.getAll();
    res.status(200).json({
      message: getMessage('OrderItem.GetAll.Success'),
      count: orderItems.length,
      order_items: orderItems,
    });
  } catch (error) {
    console.error("Get all order items error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};

// Get order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const orderItem = await OrderItem.getById(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ message: getMessage('OrderItem.GetById.NotFound') });
    }

    res.status(200).json({
      message: getMessage('OrderItem.GetById.Success'),
      order_item: orderItem,
    });
  } catch (error) {
    console.error("Get order item by ID error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};

// Get order items by order ID
export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderItems = await OrderItem.getByOrderId(orderId);

    res.status(200).json({
      message: getMessage('OrderItem.GetByOrder.Success'),
      count: orderItems.length,
      order_items: orderItems,
    });
  } catch (error) {
    console.error("Get order items by order ID error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};

// Get order items by product ID
export const getOrderItemsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const orderItems = await OrderItem.getByProductId(productId);

    res.status(200).json({
      message: getMessage('OrderItem.GetByProduct.Success'),
      count: orderItems.length,
      order_items: orderItems,
    });
  } catch (error) {
    console.error("Get order items by product ID error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};

// Update order item
export const updateOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { quantity, unit_price, discount_price } = req.body;

    if (!quantity || !unit_price) {
      return res.status(400).json({ message: getMessage('OrderItem.Update.Validation.RequiredFields') });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: getMessage('OrderItem.Update.Validation.QuantityGreaterThanZero') });
    }

    const orderItem = await OrderItem.update(orderItemId, {
      quantity,
      unit_price,
      discount_price: discount_price || null,
    });

    if (!orderItem) {
      return res.status(404).json({ message: getMessage('OrderItem.Update.NotFound') });
    }

    res.status(200).json({
      message: getMessage('OrderItem.Update.Success'),
      order_item: orderItem,
    });
  } catch (error) {
    console.error("Update order item error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};

// Delete order item
export const deleteOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const deletedOrderItem = await OrderItem.delete(orderItemId);
    if (!deletedOrderItem) {
      return res.status(404).json({ message: getMessage('OrderItem.Delete.NotFound') });
    }

    res.status(200).json({
      message: getMessage('OrderItem.Delete.Success'),
      order_item_id: deletedOrderItem.order_item_id,
    });
  } catch (error) {
    console.error("Delete order item error:", error);
    res.status(500).json({ message: getMessage('OrderItem.Common.InternalServerError'), error: error.message });
  }
};
