import express from 'express';
import {
  loginCustomer,
  registerCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  uploadCustomerProfilePhoto,
  customerProfileUploadMiddleware,
} from '../controllers/CustomerController.js';

import {
  validateCustomerRegister,
  validateCustomerUpdate,
  validateCustomerId,
} from '../middleware/validation.js';
import { ROUTES } from '../lib/ROUTES.js';

const router = express.Router();

router.post(ROUTES.CUSTOMERS.LOGIN, loginCustomer);
router.post(ROUTES.CUSTOMERS.REGISTER, validateCustomerRegister, registerCustomer);   

router.get(ROUTES.CUSTOMERS.BASE, getAllCustomers);        

router.get(ROUTES.CUSTOMERS.BY_ID, validateCustomerId, getCustomerById);    

router.post(
  ROUTES.CUSTOMERS.PROFILE_PHOTO,
  validateCustomerId,
  customerProfileUploadMiddleware,
  uploadCustomerProfilePhoto,
);

router.put(ROUTES.CUSTOMERS.BY_ID, validateCustomerId, validateCustomerUpdate, updateCustomer);    

router.delete(ROUTES.CUSTOMERS.BY_ID, validateCustomerId, deleteCustomer);         

export default router;
