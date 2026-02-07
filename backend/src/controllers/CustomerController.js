import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const customer = await Customer.getByEmail(email);
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
console.log("provided password:", password);
console.log("stored hashed password:", customer.password);
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      customer: {
        customer_id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        created_at: customer.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCustomer = await Customer.getByEmail(email);
    if (existingCustomer) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

export const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, email, phone, password } = req.body;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    const existingCustomer = await Customer.getById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (email !== existingCustomer.email) {
      const emailExists = await Customer.emailExists(email);
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedCustomer = await Customer.update(customerId, { name, email, phone, password: hashedPassword });

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

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
