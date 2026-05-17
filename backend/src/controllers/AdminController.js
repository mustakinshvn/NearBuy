import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';
import Customer from '../models/Customer.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';

function getAdminJwtSecret() {
  return process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET 
}

function signAdminToken(admin) {
  return jwt.sign(
    {
      adminId: admin.admin_id,
      email: admin.email,
      role: admin.role,
    },
    getAdminJwtSecret(),
    { expiresIn: '7d' },
  );
}

function toSafeAdmin(admin) {
  if (!admin) return null;
  const { password, ...safe } = admin;
  return safe;
}


export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.getByEmail(email);
    if (!admin || admin.is_active === false) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = signAdminToken(admin);
    const safeAdmin = toSafeAdmin(admin);

    return res.status(200).json({
      message: 'Admin login successful',
      admin: safeAdmin,
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function getAdminProfile(req, res) {
  try {
    return res.status(200).json({
      message: 'Admin profile fetched successfully',
      admin: req.admin,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function getDashboardSummary(req, res) {
  try {
    const counts = await Admin.getCounts();
    const settings = await Admin.getSettings();

    return res.status(200).json({
      message: 'Admin dashboard summary fetched successfully',
      summary: {
        totalAdmins: counts.totalAdmins,
        totalCustomers: counts.totalCustomers,
        totalVendors: counts.totalVendors,
        totalProducts: counts.totalProducts,
        totalOrders: counts.totalOrders,
        totalNotifications: counts.totalNotifications,
        unreadNotifications: counts.unreadNotifications,
        settings,
      },
    });
  } catch (error) {
    console.error('Admin dashboard summary error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function getConfiguration(req, res) {
  try {
    const settings = await Admin.getSettings();
    return res.status(200).json({
      message: 'Configuration fetched successfully',
      settings,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function updateConfiguration(req, res) {
  try {
    const updatedSettings = await Admin.upsertSettings(req.body, req.admin?.admin_id || null);
    return res.status(200).json({
      message: 'Configuration updated successfully',
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Update configuration error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function listCustomers(req, res) {
  try {
    const customers = await Customer.getAll();
    return res.status(200).json({ message: 'Customers fetched successfully', customers });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const { customerId } = req.params;
    const deleted = await Customer.delete(customerId);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.status(200).json({ message: 'Customer deleted successfully', customer: deleted });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function listVendors(req, res) {
  try {
    const vendors = await Vendor.getAll();
    return res.status(200).json({ message: 'Vendors fetched successfully', vendors });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function deleteVendor(req, res) {
  try {
    const { vendorId } = req.params;
    const deleted = await Vendor.delete(vendorId);
    if (!deleted) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    return res.status(200).json({ message: 'Vendor deleted successfully', vendor: deleted });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function listProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const offset = parseInt(req.query.offset, 10) || 0;
    const products = await Product.getAll({ limit, offset });
    return res.status(200).json({ message: 'Products fetched successfully', products });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    const deleted = await Product.delete(productId);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully', product: deleted });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function listOrders(req, res) {
  try {
    const orders = await Order.getAll();
    return res.status(200).json({ message: 'Orders fetched successfully', orders });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const deleted = await Order.delete(orderId);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order deleted successfully', order: deleted });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export async function listNotifications(req, res) {
  try {
    const notifications = await Notification.getAll();
    return res.status(200).json({ message: 'Notifications fetched successfully', notifications });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}