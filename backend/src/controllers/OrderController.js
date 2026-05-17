import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import { mergeOrdersByOrderId, pendingOrdersCount, totalSalesAmount, deliveredOrdersCount } from "../lib/utils.js";
import Product from "../models/Product.js";
import { getMessage } from '../resources/messages.js';

export const createOrder = async (req, res) => {
  try {
    const { customer_id, vendor_id, total_amount, discount_amount, payment_method, items } = req.body;

    if (!customer_id || !total_amount || !items || items.length === 0) {
      return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.RequiredFields') });
    }

    const order = await Order.create({
      customer_id,
      vendor_id,
      total_amount,
      discount_amount: discount_amount || 0,
      payment_method: payment_method || 'Cash on Delivery',
    });

    const orderItemsData = [];
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.ItemFieldsRequired') });
      }

      const orderItem = await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_price: item.discount_price || null,
        product_title: item.product_title || null,
        product_image: item.product_image || null,
      });

      orderItemsData.push(orderItem);
    }

    res.status(201).json({
      message: getMessage('Order.Create.Success'),
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
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.status(200).json({
      message: getMessage('Order.GetAll.Success'),
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: getMessage('Order.GetById.NotFound') });
    }

    const items = await OrderItem.getByOrderId(orderId);

    res.status(200).json({
      message: getMessage('Order.GetById.Success'),
      order: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.getByCustomerId(customerId);

    res.status(200).json({
      message: getMessage('Order.GetByCustomer.Success'),
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders by customer error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const orders = await Order.getByVendorId(vendorId);
    const mergedOrders = await mergeOrdersByOrderId(orders);
    const orderCount = mergedOrders.length;
    const pendingCount = await pendingOrdersCount(mergedOrders);
    const deliveredCount = await deliveredOrdersCount(mergedOrders);
    const totalSales = await totalSalesAmount(mergedOrders);
    const totalAvaibleProducts = (await Product.getBySeller(vendorId)).length;
    mergedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({
      message: getMessage('Order.GetByVendor.Success'),
      orderCount,
      pendingCount,
      deliveredCount,
      totalSales,
      orders: mergedOrders,
      totalAvaibleProducts
    });
  } catch (error) {
    console.error("Get orders by vendor error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({ message: getMessage('Order.UpdateStatus.Validation.OrderStatusRequired') });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: getMessage('Order.UpdateStatus.Validation.InvalidStatus') + validStatuses.join(', ') });
    }

    const order = await Order.updateOrderStatus(orderId, order_status);
    if (!order) {
      return res.status(404).json({ message: getMessage('Order.UpdateStatus.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Order.UpdateStatus.Success'),
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({ message: getMessage('Order.UpdatePayment.Validation.PaymentStatusRequired') });
    }

    const validStatuses = ['Pending', 'Paid', 'Refunded'];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ message: getMessage('Order.UpdatePayment.Validation.InvalidStatus') + validStatuses.join(', ') });
    }

    const order = await Order.updatePaymentStatus(orderId, payment_status);
    if (!order) {
      return res.status(404).json({ message: getMessage('Order.UpdatePayment.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Order.UpdatePayment.Success'),
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const getPastOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.getPastOrdersByCustomerId(customerId);

    res.status(200).json({
      message: getMessage('Order.GetPastByCustomer.Success'),
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get past orders by customer error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const getAllPastOrders = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const validLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
    const validOffset = Math.max(parseInt(offset) || 0, 0);

    const orders = await Order.getAllPastOrders(validLimit, validOffset);

    res.status(200).json({
      message: getMessage('Order.GetAllPast.Success'),
      count: orders.length,
      limit: validLimit,
      offset: validOffset,
      orders,
    });
  } catch (error) {
    console.error("Get all past orders error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await OrderItem.deleteByOrderId(orderId);

    const deletedOrder = await Order.delete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: getMessage('Order.Delete.NotFound') });
    }

    res.status(200).json({
      message: getMessage('Order.Delete.Success'),
      order_id: deletedOrder.order_id,
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: getMessage('Order.Common.InternalServerError'), error: error.message });
  }
};
