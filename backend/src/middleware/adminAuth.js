import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

function getAdminJwtSecret() {
  return process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'nearbuy-admin-secret-change-me';
}

export async function requireAdminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Admin authentication required' });
    }

    const payload = jwt.verify(token, getAdminJwtSecret());
    const admin = await Admin.getById(payload.adminId);

    if (!admin || admin.is_active === false) {
      return res.status(401).json({ message: 'Admin account is not active' });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
}