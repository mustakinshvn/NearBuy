import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByVendor,
  updateOrderStatus,
  updatePaymentStatus,
  getPastOrdersByCustomer,
  getAllPastOrders,
  deleteOrder,
} from '../controllers/OrderController.js';

import {
  validateOrderCreate,
  validateOrderId,
} from '../middleware/validation.js';
import { ROUTES } from '../lib/ROUTES.js';

const router = express.Router();

// Order routes
router.post(ROUTES.ORDERS.BASE, validateOrderCreate, createOrder);

router.get(ROUTES.ORDERS.BASE, getAllOrders);

router.get(ROUTES.ORDERS.PAST_ALL, getAllPastOrders);

router.get(ROUTES.ORDERS.BY_ID, validateOrderId, getOrderById);

router.get(ROUTES.ORDERS.BY_CUSTOMER, getOrdersByCustomer);

router.get(ROUTES.ORDERS.PAST_BY_CUSTOMER, getPastOrdersByCustomer);

router.get(ROUTES.ORDERS.BY_VENDOR, getOrdersByVendor);

router.put(ROUTES.ORDERS.STATUS, validateOrderId, updateOrderStatus);

router.put(ROUTES.ORDERS.PAYMENT_STATUS, validateOrderId, updatePaymentStatus);

router.delete(ROUTES.ORDERS.BY_ID, validateOrderId, deleteOrder);

export default router;
