import { Router } from 'express';
import {
  loginAdmin,
  getAdminProfile,
  getDashboardSummary,
  getConfiguration,
  updateConfiguration,
  listCustomers,
  deleteCustomer,
  listVendors,
  deleteVendor,
  listProducts,
  deleteProduct,
  listOrders,
  deleteOrder,
  listNotifications,
} from '../controllers/AdminController.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.post('/auth/login', loginAdmin);
router.get('/auth/me', requireAdminAuth, getAdminProfile);
router.get('/dashboard/summary', requireAdminAuth, getDashboardSummary);
router.get('/configuration', requireAdminAuth, getConfiguration);
router.put('/configuration', requireAdminAuth, updateConfiguration);

router.get('/customers', requireAdminAuth, listCustomers);
router.delete('/customers/:customerId', requireAdminAuth, deleteCustomer);

router.get('/vendors', requireAdminAuth, listVendors);
router.delete('/vendors/:vendorId', requireAdminAuth, deleteVendor);

router.get('/products', requireAdminAuth, listProducts);
router.delete('/products/:productId', requireAdminAuth, deleteProduct);

router.get('/orders', requireAdminAuth, listOrders);
router.delete('/orders/:orderId', requireAdminAuth, deleteOrder);

router.get('/notifications', requireAdminAuth, listNotifications);

export default router;