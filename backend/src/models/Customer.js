import pool from '../config/db.js';

class Customer {
  // Create a new customer
  static async create(data) {
    const { name, email, phone, password } = data;
    try {
      const result = await pool.query(
        `INSERT INTO customers (name, email, phone, password) 
         VALUES ($1, $2, $3, $4) 
         RETURNING customer_id, name, email, phone, created_at`,
        [name, email, phone, password]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating customer: ${error.message}`);
    }
  }

  // Get all customers
  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT customer_id, name, email, phone, created_at FROM customers ORDER BY created_at DESC`
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  }

  // Get customer by ID
  static async getById(customerId) {
    try {
      const result = await pool.query(
        `SELECT customer_id, name, email, phone, created_at FROM customers WHERE customer_id = $1`,
        [customerId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching customer: ${error.message}`);
    }
  }

  // Get customer by email
  static async getByEmail(email) {
    try {
      const result = await pool.query(
        `SELECT * FROM customers WHERE email = $1`,
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching customer by email: ${error.message}`);
    }
  }

  // Update customer
  static async update(customerId, data) {
    const { name, email, phone } = data;
    try {
      const result = await pool.query(
        `UPDATE customers SET name = $1, email = $2, phone = $3 
         WHERE customer_id = $4 
         RETURNING customer_id, name, email, phone, created_at`,
        [name, email, phone, customerId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating customer: ${error.message}`);
    }
  }

  // Delete customer
  static async delete(customerId) {
    try {
      const result = await pool.query(
        `DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id`,
        [customerId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting customer: ${error.message}`);
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      const result = await pool.query(
        `SELECT customer_id FROM customers WHERE email = $1`,
        [email]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking email: ${error.message}`);
    }
  }
}

export default Customer;
