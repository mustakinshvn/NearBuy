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
import { ROUTES } from '../lib/ROUTES.js';

const router = Router();

router.post(ROUTES.ADMIN.AUTH_LOGIN, loginAdmin);
router.get(ROUTES.ADMIN.AUTH_ME, requireAdminAuth, getAdminProfile);
router.get(ROUTES.ADMIN.DASHBOARD_SUMMARY, requireAdminAuth, getDashboardSummary);
router.get(ROUTES.ADMIN.CONFIGURATION, requireAdminAuth, getConfiguration);
router.put(ROUTES.ADMIN.CONFIGURATION, requireAdminAuth, updateConfiguration);

router.get(ROUTES.ADMIN.CUSTOMERS, requireAdminAuth, listCustomers);
router.delete(ROUTES.ADMIN.CUSTOMER_BY_ID, requireAdminAuth, deleteCustomer);

router.get(ROUTES.ADMIN.VENDORS, requireAdminAuth, listVendors);
router.delete(ROUTES.ADMIN.VENDOR_BY_ID, requireAdminAuth, deleteVendor);

router.get(ROUTES.ADMIN.PRODUCTS, requireAdminAuth, listProducts);
router.delete(ROUTES.ADMIN.PRODUCT_BY_ID, requireAdminAuth, deleteProduct);

router.get(ROUTES.ADMIN.ORDERS, requireAdminAuth, listOrders);
router.delete(ROUTES.ADMIN.ORDER_BY_ID, requireAdminAuth, deleteOrder);

router.get(ROUTES.ADMIN.NOTIFICATIONS, requireAdminAuth, listNotifications);

export default router;