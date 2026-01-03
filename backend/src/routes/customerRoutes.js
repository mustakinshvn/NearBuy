import express from 'express';
import {
  loginCustomer,
  registerCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/CustomerController.js';

import {
  validateCustomerRegister,
  validateCustomerUpdate,
  validateCustomerId,
} from '../middleware/validation.js';

const router = express.Router();

router.post('/login', loginCustomer);
router.post('/register', validateCustomerRegister, registerCustomer);   

router.get('/', getAllCustomers);        

router.get('/:customerId', validateCustomerId, getCustomerById);    

router.put('/:customerId', validateCustomerId, validateCustomerUpdate, updateCustomer);    

router.delete('/:customerId', validateCustomerId, deleteCustomer);         

export default router;
