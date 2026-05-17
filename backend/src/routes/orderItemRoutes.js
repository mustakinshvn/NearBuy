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
import { ROUTES } from '../lib/ROUTES.js';

const router = express.Router();

// Order Item routes
router.post(ROUTES.ORDER_ITEMS.BASE, validateOrderItemCreate, addOrderItem);

router.get(ROUTES.ORDER_ITEMS.BASE, getAllOrderItems);

router.get(ROUTES.ORDER_ITEMS.BY_ID, validateOrderItemId, getOrderItemById);

router.get(ROUTES.ORDER_ITEMS.BY_ORDER, getOrderItemsByOrderId);

router.get(ROUTES.ORDER_ITEMS.BY_PRODUCT, getOrderItemsByProductId);

router.put(ROUTES.ORDER_ITEMS.BY_ID, validateOrderItemId, updateOrderItem);

router.delete(ROUTES.ORDER_ITEMS.BY_ID, validateOrderItemId, deleteOrderItem);

export default router;
