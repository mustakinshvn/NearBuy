import pool from '../config/db.js';
import bcrypt from "bcrypt";

class vendor {
    static async create (data){
        try {
            const {
                name,
                email,
                phone = null,
                password,
                shop_name = null,
                shop_type = null,
                description = null,
                street = null,
                area = null,
                city = null,
                country = null,
                postal_code = null
            } = data;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `
            INSERT INTO vendors
            (name, email, phone, password, shop_name, shop_type, description, street, area, city, country, postal_code)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING *;
            `;

            const values = [
                name,
                email,
                phone,
                hashedPassword,
                shop_name,
                shop_type,
                description,
                street,
                area,
                city,
                country,
                postal_code
            ];

            const { rows } = await pool.query(query, values);
            return rows[0];

        } catch (error) {
            throw new Error(`Error creating vendor: ${error.message}`);
        }
    }

    static async getById(vendorId){
        try {
            const query = `SELECT * FROM vendors WHERE vendor_id = $1`;
            const values = [vendorId];

            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching vendor by ID: ${error.message}`);
        }
    }

    static async getByPhone(phone){
        try {
            const query = `SELECT * FROM vendors WHERE phone = $1`;
            const values = [phone]; 
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching vendor by phone: ${error.message}`);
        }
    }

    static async getByEmail(email){
        try {
            const query = `SELECT * FROM vendors WHERE email = $1`; 
            const values = [email];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching vendor by email: ${error.message}`);
        }
    }

    static async getAll(){
        try {
            const query = `SELECT * FROM vendors ORDER BY created_at DESC`;
            const {rows} = await pool.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all vendors: ${error.message}`);
        }
    }

    static async getByType(shop_type){
        try {
            const query = `SELECT * FROM vendors WHERE shop_type = $1 ORDER BY created_at DESC`;
            const values = [shop_type];
            const {rows} = await pool.query(query, values);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching vendors by type: ${error.message}`);
        }
    }

    static async update(vendorId, data){
        try {
            const {
                name,
                email,
                phone,
                shop_name,
                shop_type,
                description,
                street,
                area,
                city,
                country,
                postal_code
            } = data;
            const query = `
            UPDATE vendors
            SET name = $1,
                email = $2,
                phone = $3,
                shop_name = $4,
                shop_type = $5,
                description = $6,
                street = $7,
                area = $8,
                city = $9,
                country = $10,
                postal_code = $11
            WHERE vendor_id = $12
            RETURNING *;
            `;

            const values = [
                name,
                email,
                phone,
                shop_name,
                shop_type,
                description,
                street,
                area,
                city,
                country,
                postal_code,
                vendorId
            ];

            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error updating vendor: ${error.message}`);
        }
    }

    static async delete(vendorId){
        try {
            const query = `DELETE FROM vendors WHERE vendor_id = $1 RETURNING *;`;
            const values = [vendorId];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error deleting vendor: ${error.message}`);
        }
    }
}

export default vendor;