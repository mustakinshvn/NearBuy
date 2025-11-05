import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";

// Register a new customer
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingCustomer = await Customer.getByEmail(email);
    if (existingCustomer) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Customer registered successfully",
      customer: {
        customer_id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        created_at: customer.created_at,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.status(200).json({
      message: "Customers fetched successfully",
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const customer = await Customer.getById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer fetched successfully",
      customer,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, email, phone } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    // Check if customer exists
    const existingCustomer = await Customer.getById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if new email is already taken by another customer
    if (email !== existingCustomer.email) {
      const emailExists = await Customer.emailExists(email);
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const updatedCustomer = await Customer.update(customerId, { name, email, phone });

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Check if customer exists
    const customer = await Customer.getById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await Customer.delete(customerId);

    res.status(200).json({
      message: "Customer deleted successfully",
      customer_id: customerId,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};
