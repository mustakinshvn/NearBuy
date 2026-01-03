// Validate customer registration input
export const validateCustomerRegister = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Check required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate phone format (11 digits)
  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Phone must be 11 digits' });
  }

  // Validate password strength (minimum 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

// Validate customer update input
export const validateCustomerUpdate = (req, res, next) => {
  const { name, email, phone } = req.body;

  // Check required fields
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate phone format (11 digits)
  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Phone must be 11 digits' });
  }

  next();
};

// Validate customer ID (ensure it's a valid number)
export const validateCustomerId = (req, res, next) => {
  const { customerId } = req.params;

  // Check if customerId exists and is a valid positive integer
  if (!customerId || isNaN(customerId) || parseInt(customerId) <= 0) {
    return res.status(400).json({ message: 'Valid customer ID (positive number) is required' });
  }

  next();
};

// Validate order creation input
export const validateOrderCreate = (req, res, next) => {
  const { customer_id, total_amount, items } = req.body;

  // Check required fields
  if (!customer_id || !total_amount || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'customer_id, total_amount, and items array are required' });
  }

  // Validate customer_id is a positive integer
  if (isNaN(customer_id) || parseInt(customer_id) <= 0) {
    return res.status(400).json({ message: 'Valid customer_id (positive number) is required' });
  }

  // Validate total_amount is a positive number
  if (isNaN(total_amount) || parseFloat(total_amount) <= 0) {
    return res.status(400).json({ message: 'total_amount must be a positive number' });
  }

  // Validate each item
  for (const item of items) {
    if (!item.product_id || !item.quantity || !item.unit_price) {
      return res.status(400).json({ message: 'Each item must have product_id, quantity, and unit_price' });
    }

    if (isNaN(item.product_id) || parseInt(item.product_id) <= 0) {
      return res.status(400).json({ message: 'Each item product_id must be a positive number' });
    }

    if (isNaN(item.quantity) || parseInt(item.quantity) <= 0) {
      return res.status(400).json({ message: 'Each item quantity must be a positive number' });
    }

    if (isNaN(item.unit_price) || parseFloat(item.unit_price) <= 0) {
      return res.status(400).json({ message: 'Each item unit_price must be a positive number' });
    }
  }

  next();
};

// Validate order ID (ensure it's a valid number)
export const validateOrderId = (req, res, next) => {
  const { orderId } = req.params;

  // Check if orderId exists and is a valid positive integer
  if (!orderId || isNaN(orderId) || parseInt(orderId) <= 0) {
    return res.status(400).json({ message: 'Valid order ID (positive number) is required' });
  }

  next();
};

// Validate order item creation input
export const validateOrderItemCreate = (req, res, next) => {
  const { order_id, product_id, quantity, unit_price } = req.body;

  // Check required fields
  if (!order_id || !product_id || !quantity || !unit_price) {
    return res.status(400).json({ message: 'order_id, product_id, quantity, and unit_price are required' });
  }

  // Validate order_id
  if (isNaN(order_id) || parseInt(order_id) <= 0) {
    return res.status(400).json({ message: 'Valid order_id (positive number) is required' });
  }

  // Validate product_id
  if (isNaN(product_id) || parseInt(product_id) <= 0) {
    return res.status(400).json({ message: 'Valid product_id (positive number) is required' });
  }

  // Validate quantity
  if (isNaN(quantity) || parseInt(quantity) <= 0) {
    return res.status(400).json({ message: 'quantity must be a positive number' });
  }

  // Validate unit_price
  if (isNaN(unit_price) || parseFloat(unit_price) <= 0) {
    return res.status(400).json({ message: 'unit_price must be a positive number' });
  }

  next();
};

// Validate order item ID
export const validateOrderItemId = (req, res, next) => {
  const { orderItemId } = req.params;

  // Check if orderItemId exists and is a valid positive integer
  if (!orderItemId || isNaN(orderItemId) || parseInt(orderItemId) <= 0) {
    return res.status(400).json({ message: 'Valid order item ID (positive number) is required' });
  }

  next();
};

// Validate payment creation input
export const validatePaymentCreate = (req, res, next) => {
  const { order_id, payment_method, payment_amount } = req.body;

  // Check required fields
  if (!order_id || !payment_method || !payment_amount) {
    return res.status(400).json({ message: 'order_id, payment_method, and payment_amount are required' });
  }

  // Validate order_id
  if (isNaN(order_id) || parseInt(order_id) <= 0) {
    return res.status(400).json({ message: 'Valid order_id (positive number) is required' });
  }

  // Validate payment_method
  const validMethods = ['Cash on Delivery', 'bKash', 'Card', 'SSLCommerz'];
  if (!validMethods.includes(payment_method)) {
    return res.status(400).json({ message: `payment_method must be one of: ${validMethods.join(', ')}` });
  }

  // Validate payment_amount
  if (isNaN(payment_amount) || parseFloat(payment_amount) <= 0) {
    return res.status(400).json({ message: 'payment_amount must be a positive number' });
  }

  next();
};

// Validate payment ID
export const validatePaymentId = (req, res, next) => {
  const { paymentId } = req.params;

  // Check if paymentId exists and is a valid positive integer
  if (!paymentId || isNaN(paymentId) || parseInt(paymentId) <= 0) {
    return res.status(400).json({ message: 'Valid payment ID (positive number) is required' });
  }

  next();
};

// Validate notification creation input
export const validateNotificationCreate = (req, res, next) => {
  const { title, message, customer_id, vendor_id } = req.body;

  // Check required fields
  if (!title || !message) {
    return res.status(400).json({ message: 'title and message are required' });
  }

  // At least one recipient is required
  if (!customer_id && !vendor_id) {
    return res.status(400).json({ message: 'At least customer_id or vendor_id is required' });
  }

  // Validate title is a string with reasonable length
  if (typeof title !== 'string' || title.length === 0 || title.length > 255) {
    return res.status(400).json({ message: 'title must be a non-empty string (max 255 characters)' });
  }

  // Validate message is a string
  if (typeof message !== 'string' || message.length === 0) {
    return res.status(400).json({ message: 'message must be a non-empty string' });
  }

  // Validate customer_id if provided
  if (customer_id && (isNaN(customer_id) || parseInt(customer_id) <= 0)) {
    return res.status(400).json({ message: 'Valid customer_id (positive number) is required' });
  }

  // Validate vendor_id if provided
  if (vendor_id && (isNaN(vendor_id) || parseInt(vendor_id) <= 0)) {
    return res.status(400).json({ message: 'Valid vendor_id (positive number) is required' });
  }

  next();
};

// Validate notification ID
export const validateNotificationId = (req, res, next) => {
  const { notificationId } = req.params;

  // Check if notificationId exists and is a valid positive integer
  if (!notificationId || isNaN(notificationId) || parseInt(notificationId) <= 0) {
    return res.status(400).json({ message: 'Valid notification ID (positive number) is required' });
  }

  next();
};
