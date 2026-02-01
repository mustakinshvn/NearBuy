import Vendor from "../models/Vendor.js";
import bcrypt from "bcrypt";

export const loginVendor = async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const vendor = await Vendor.getByEmail(email);
        if (!vendor) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPassValid = password === vendor.password;
        // const isPasswordValid = await bcrypt.compare(password, vendor.password);
        // if(!isPassWordValid){
        //     return res.status(401).json({ message: "Invalid email or password" });
        // }

        //this is for plain text password comparison, will be replaced with bcrypt later
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            message: "Vendor Login successful",
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
                created_at: vendor.created_at
            }
        });

    }catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const registerVendor = async (req, res) => {
    try {
        const { name, email, phone, password, shop_name, shop_type, description, street, area, city, country, postal_code } = req.body;

        if (!name || !email || !password || !shop_name || !shop_type || !street || !area || !city || !country) {
            return res.status(400).json({ message: "All required fields must be provided (name, email, password, shop_name, shop_type, street, area, city, country)" });
        }
        if (phone) {
            const existingVendorByPhone = await Vendor.getByPhone(phone);
            if (existingVendorByPhone) {
                return res.status(409).json({ message: "Phone number already exists" });
            }
        }

        const existingVendorByEmail = await Vendor.getByEmail(email);
        if (existingVendorByEmail) {
            return res.status(409).json({ message: "Email already exists" });
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
            postal_code
        });
        res.status(201).json({
            message: "Vendor registered successfully",
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
                created_at: vendor.created_at
            }
        });
    } catch (error) {
        console.error("Error registering vendor:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.getById(id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({
            message: "Vendor fetched successfully",
            vendor
        });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const getVendorByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        const vendor = await Vendor.getByPhone(phone);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({
            message: "Vendor fetched successfully",
            vendor
        });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getVendorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const vendor = await Vendor.getByEmail(email);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({
            message: "Vendor fetched successfully",
            vendor
        });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.getAll();
        res.status(200).json({
            message: "Vendors fetched successfully",
            vendors
        });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getVendorsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const vendors = await Vendor.getByType(type);
        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: "No vendors found for this shop type" });
        }
        res.status(200).json({
            message: "Vendors fetched successfully",
            vendors
        });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedVendor = await Vendor.update(id, updateData);
        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({
            message: "Vendor updated successfully",
            vendor: updatedVendor
        });
    } catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
    


export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVendor = await Vendor.delete(id);
        if (!deletedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({
            message: "Vendor deleted successfully",
            vendor: deletedVendor
        });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};