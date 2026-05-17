import { Router } from 'express';
import { loginVendor, registerVendor, getAllVendors, getVendorByEmail, getVendorById, getVendorByPhone, getVendorsByType, deleteVendor, updateVendor, uploadVendorProfilePhoto, vendorProfileUploadMiddleware } from '../controllers/VendorController.js';
import { ROUTES } from '../lib/ROUTES.js';

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post(ROUTES.VENDORS.LOGIN, asyncHandler(loginVendor));
router.post(ROUTES.VENDORS.BASE, asyncHandler(registerVendor));
router.get(ROUTES.VENDORS.BASE, asyncHandler(getAllVendors));
router.get(ROUTES.VENDORS.EMAIL, asyncHandler(getVendorByEmail));
router.get(ROUTES.VENDORS.PHONE, asyncHandler(getVendorByPhone));
router.get(ROUTES.VENDORS.TYPE, asyncHandler(getVendorsByType));
router.get(ROUTES.VENDORS.BY_ID, asyncHandler(getVendorById));

router.post(ROUTES.VENDORS.PROFILE_PHOTO, vendorProfileUploadMiddleware, asyncHandler(uploadVendorProfilePhoto));

router.put(ROUTES.VENDORS.BY_ID, asyncHandler(updateVendor));
router.patch(ROUTES.VENDORS.BY_ID, asyncHandler(updateVendor));
router.delete(ROUTES.VENDORS.BY_ID, asyncHandler(deleteVendor));

export default router;