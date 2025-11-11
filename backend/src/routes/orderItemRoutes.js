import express from 'express';
import {
  addOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  getOrderItemsByProductId,
  updateOrderItem,
  deleteOrderItem,
} from '../controllers/OrderItemController.js';

import {
  validateOrderItemCreate,
  validateOrderItemId,
} from '../middleware/validation.js';

const router = express.Router();

// Order Item routes
router.post('/', validateOrderItemCreate, addOrderItem);

router.get('/', getAllOrderItems);

router.get('/:orderItemId', validateOrderItemId, getOrderItemById);

router.get('/order/:orderId', getOrderItemsByOrderId);

router.get('/product/:productId', getOrderItemsByProductId);

router.put('/:orderItemId', validateOrderItemId, updateOrderItem);

router.delete('/:orderItemId', validateOrderItemId, deleteOrderItem);

export default router;
