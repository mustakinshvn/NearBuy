import Vendor from "../models/Vendor.js";
import bcrypt from "bcrypt";
import { vendorProfileImageUpload, getUploadedSingleImagePath } from '../middleware/upload.js';
import { toPublicUrl } from '../lib/publicUrl.js';
import { updateOneColumnIfExists } from '../lib/dbColumns.js';
import { getMessage } from '../resources/messages.js';

export const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: getMessage('Vendor.Login.Validation.EmailAndPasswordRequired') });
        }

        const vendor = await Vendor.getByEmail(email);
        if (!vendor) {
            return res.status(401).json({ message: getMessage('Vendor.Login.Auth.InvalidCredentials') });
        }

        const isPassValid = password === vendor.password;
        // This is for testing purposes only. In production, always hash passwords and use bcrypt.compare().
        // const isPassValid = await bcrypt.compare(password, vendor.password);

        if (!isPassValid) {
            return res.status(401).json({ message: getMessage('Vendor.Login.Auth.InvalidCredentials') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.Login.Success'),
            vendor: {
                vendor_id: vendor.vendor_id,
                name: vendor.name,
                email: vendor.email,
                phone: vendor.phone,
                shop_name: vendor.shop_name,
                shop_type: vendor.shop_type,
                description: vendor.description,
                street: vendor.street,
                area: vendor.area,
                city: vendor.city,
                country: vendor.country,
                postal_code: vendor.postal_code,
                profile_image_url:
                    vendor.profile_image_url ||
                    vendor.avatar_url ||
                    vendor.logo_url ||
                    vendor.logo ||
                    vendor.image_url ||
                    vendor.image ||
                    null,
                created_at: vendor.created_at,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const registerVendor = async (req, res) => {
    try {
        const { name, email, phone, password, shop_name, shop_type, description, street, area, city, country, postal_code } = req.body;

        if (!name || !email || !password || !shop_name || !shop_type || !street || !area || !city || !country) {
            return res.status(400).json({ message: getMessage('Vendor.Register.Validation.RequiredFields') });
        }

        if (phone) {
            const existingVendorByPhone = await Vendor.getByPhone(phone);
            if (existingVendorByPhone) {
                return res.status(409).json({ message: getMessage('Vendor.Register.Validation.PhoneAlreadyExists') });
            }
        }

        const existingVendorByEmail = await Vendor.getByEmail(email);
        if (existingVendorByEmail) {
            return res.status(409).json({ message: getMessage('Vendor.Register.Validation.EmailAlreadyExists') });
        }

        const vendor = await Vendor.create({
            name,
            email,
            phone,
            password,
            shop_name,
            shop_type,
            description,
            street,
            area,
            city,
            country,
            postal_code,
        });

        return res.status(201).json({
            message: getMessage('Vendor.Register.Success'),
            vendor: {
                vendor_id: vendor.vendor_id,
                name: vendor.name,
                email: vendor.email,
                phone: vendor.phone,
                shop_name: vendor.shop_name,
                shop_type: vendor.shop_type,
                description: vendor.description,
                street: vendor.street,
                area: vendor.area,
                city: vendor.city,
                country: vendor.country,
                postal_code: vendor.postal_code,
                created_at: vendor.created_at,
            },
        });
    } catch (error) {
        console.error('Error registering vendor:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.getById(id);

        if (!vendor) {
            return res.status(404).json({ message: getMessage('Vendor.GetById.NotFound') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.GetById.Success'),
            vendor,
        });
    } catch (error) {
        console.error('Error fetching vendor:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const getVendorByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        const vendor = await Vendor.getByPhone(phone);

        if (!vendor) {
            return res.status(404).json({ message: getMessage('Vendor.GetByPhone.NotFound') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.GetByPhone.Success'),
            vendor,
        });
    } catch (error) {
        console.error('Error fetching vendor:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const getVendorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const vendor = await Vendor.getByEmail(email);

        if (!vendor) {
            return res.status(404).json({ message: getMessage('Vendor.GetByEmail.NotFound') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.GetByEmail.Success'),
            vendor,
        });
    } catch (error) {
        console.error('Error fetching vendor:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.getAll();
        return res.status(200).json({
            message: getMessage('Vendor.GetAll.Success'),
            vendors,
        });
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const getVendorsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const vendors = await Vendor.getByType(type);

        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: getMessage('Vendor.GetByType.NotFound') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.GetByType.Success'),
            vendors,
        });
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedVendor = await Vendor.update(id, updateData);

        if (!updatedVendor) {
            return res.status(404).json({ message: getMessage('Vendor.Update.NotFound') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.Update.Success'),
            vendor: updatedVendor,
        });
    } catch (error) {
        console.error('Error updating vendor:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVendor = await Vendor.delete(id);

        if (!deletedVendor) {
            return res.status(404).json({ message: getMessage('Vendor.Delete.NotFound') });
        }

        return res.status(200).json({
            message: getMessage('Vendor.Delete.Success'),
            vendor: deletedVendor,
        });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const uploadVendorProfilePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: getMessage('Vendor.Profile.Upload.Validation.VendorIdRequired') });
        }

        const relPath = getUploadedSingleImagePath(req, 'profiles/vendors');
        if (!relPath) {
            return res.status(400).json({ message: getMessage('Vendor.Profile.Upload.Validation.NoProfileImageUploaded') });
        }

        const url = toPublicUrl(req, relPath);

        const result = await updateOneColumnIfExists({
            tableName: 'vendors',
            idColumn: 'vendor_id',
            idValue: Number(id),
            candidateColumns: [
                'profile_image_url',
                'avatar_url',
                'logo_url',
                'logo',
                'image_url',
                'image',
            ],
            value: url,
        });

        return res.status(200).json({
            message: getMessage('Vendor.Profile.Upload.Success'),
            profile_image_url: url,
            persisted: result.updated,
            vendor: result.row,
        });
    } catch (error) {
        console.error('Vendor profile photo upload error:', error);
        return res.status(500).json({ message: getMessage('Vendor.Common.InternalServerError'), error: error.message });
    }
};

export const vendorProfileUploadMiddleware = (req, res, next) => {
    vendorProfileImageUpload(req, res, (err) => {
        if (!err) return next();
        const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
        return res.status(status).json({ message: err.message || getMessage('Upload.Common.FileUploadFailed') });
    });
};