import { Router } from 'express';
import { registerVendor, getAllVendors, getVendorByEmail, getVendorById, getVendorByPhone, getVendorsByType, deleteVendor, updateVendor } from '../controllers/VendorController.js';

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', asyncHandler(registerVendor));
router.get('/', asyncHandler(getAllVendors));
router.get('/email/:email', asyncHandler(getVendorByEmail));
router.get('/phone/:phone', asyncHandler(getVendorByPhone));
router.get('/type/:type', asyncHandler(getVendorsByType));
router.get('/:id', asyncHandler(getVendorById));
router.put('/:id', asyncHandler(updateVendor));
router.patch('/:id', asyncHandler(updateVendor));
router.delete('/:id', asyncHandler(deleteVendor));

export default router;