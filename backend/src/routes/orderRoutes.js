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

const router = express.Router();

// Order routes
router.post('/', validateOrderCreate, createOrder);

router.get('/', getAllOrders);

router.get('/past/all', getAllPastOrders);

router.get('/:orderId', validateOrderId, getOrderById);

router.get('/customer/:customerId', getOrdersByCustomer);

router.get('/customer/:customerId/past', getPastOrdersByCustomer);

router.get('/vendor/:vendorId', getOrdersByVendor);

router.put('/:orderId/status', validateOrderId, updateOrderStatus);

router.put('/:orderId/payment-status', validateOrderId, updatePaymentStatus);

router.delete('/:orderId', validateOrderId, deleteOrder);

export default router;
