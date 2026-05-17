import bcrypt from 'bcrypt';
import pool from '../config/db.js';

class Admin {
  static async create(data) {
    try {
      const {
        name,
        email,
        password,
        role = 'superadmin',
        is_active = true,
      } = data;

      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await pool.query(
        `INSERT INTO admin_users (name, email, password, role, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING admin_id, name, email, role, is_active, created_at, updated_at`,
        [name, email, hashedPassword, role, is_active],
      );

      return rows[0];
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  }

  static async getByEmail(email) {
    try {
      const { rows } = await pool.query(
        `SELECT admin_id, name, email, password, role, is_active, created_at, updated_at
         FROM admin_users
         WHERE email = $1`,
        [email],
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching admin by email: ${error.message}`);
    }
  }

  static async getById(adminId) {
    try {
      const { rows } = await pool.query(
        `SELECT admin_id, name, email, role, is_active, created_at, updated_at
         FROM admin_users
         WHERE admin_id = $1`,
        [adminId],
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching admin by ID: ${error.message}`);
    }
  }

  static async ensureDefaultAdmin() {
    try {
      const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM admin_users`);
      if ((rows[0]?.count || 0) > 0) {
        return { created: false, reason: 'admin-exists' };
      }

      const name = process.env.ADMIN_DEFAULT_NAME;
      const email = process.env.ADMIN_DEFAULT_EMAIL;
      const password = process.env.ADMIN_DEFAULT_PASSWORD;

      if (!name || !email || !password) {
        return { created: false, reason: 'missing-default-admin-env' };
      }

      const admin = await Admin.create({ name, email, password, role: 'superadmin' });
      return { created: true, admin };
    } catch (error) {
      return { created: false, reason: error.message };
    }
  }

  static async getSettings() {
    try {
      const { rows } = await pool.query(
        `SELECT setting_key, setting_value, updated_by_admin_id, created_at, updated_at
         FROM admin_settings
         ORDER BY setting_key ASC`,
      );

      return rows.reduce((acc, row) => {
        acc[row.setting_key] = {
          value: row.setting_value,
          updated_by_admin_id: row.updated_by_admin_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
        return acc;
      }, {});
    } catch (error) {
      throw new Error(`Error fetching admin settings: ${error.message}`);
    }
  }

  static async getSetting(settingKey, fallback = null) {
    try {
      const { rows } = await pool.query(
        `SELECT setting_value
         FROM admin_settings
         WHERE setting_key = $1`,
        [settingKey],
      );

      return rows[0]?.setting_value ?? fallback;
    } catch (error) {
      throw new Error(`Error fetching admin setting ${settingKey}: ${error.message}`);
    }
  }

  static async getSettingInt(settingKey, fallback = 0) {
    const value = await Admin.getSetting(settingKey, null);
    const parsed = Number.parseInt(value, 10);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }

    const parsedFallback = Number.parseInt(fallback, 10);
    return Number.isFinite(parsedFallback) && parsedFallback > 0 ? parsedFallback : 0;
  }

  static async upsertSettings(entries, updatedByAdminId = null) {
    try {
      const pairs = Object.entries(entries || {}).filter(([, value]) => value !== undefined);
      if (pairs.length === 0) {
        return Admin.getSettings();
      }

      for (const [settingKey, settingValue] of pairs) {
        await pool.query(
          `INSERT INTO admin_settings (setting_key, setting_value, updated_by_admin_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (setting_key)
           DO UPDATE SET
             setting_value = EXCLUDED.setting_value,
             updated_by_admin_id = EXCLUDED.updated_by_admin_id,
             updated_at = CURRENT_TIMESTAMP`,
          [settingKey, String(settingValue), updatedByAdminId],
        );
      }

      return Admin.getSettings();
    } catch (error) {
      throw new Error(`Error updating admin settings: ${error.message}`);
    }
  }

  static async getCounts() {
    try {
      const { rows } = await pool.query(
        `SELECT
           (SELECT COUNT(*)::int FROM customers) AS total_customers,
           (SELECT COUNT(*)::int FROM vendors) AS total_vendors,
           (SELECT COUNT(*)::int FROM products) AS total_products,
           (SELECT COUNT(*)::int FROM orders) AS total_orders,
           (SELECT COUNT(*)::int FROM notifications WHERE is_deleted = FALSE) AS total_notifications,
           (SELECT COUNT(*)::int FROM notifications WHERE is_deleted = FALSE AND is_read = FALSE) AS unread_notifications,
           (SELECT COUNT(*)::int FROM admin_users) AS total_admins
         `,
      );

      const r = rows[0] || {};
      return {
        totalCustomers: Number(r.total_customers || 0),
        totalVendors: Number(r.total_vendors || 0),
        totalProducts: Number(r.total_products || 0),
        totalOrders: Number(r.total_orders || 0),
        totalNotifications: Number(r.total_notifications || 0),
        unreadNotifications: Number(r.unread_notifications || 0),
        totalAdmins: Number(r.total_admins || 0),
      };
    } catch (error) {
      throw new Error(`Error fetching dashboard counts: ${error.message}`);
    }
  }
}

export default Admin;