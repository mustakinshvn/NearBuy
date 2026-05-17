import { getMessage } from '../resources/messages.js';

export const validateCustomerRegister = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Register.Validation.RequiredFields') });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Register.Validation.InvalidEmailFormat') });
  }

  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Register.Validation.PhoneMustBe11Digits') });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Register.Validation.PasswordMinLength') });
  }

  next();
};

export const validateCustomerUpdate = (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Update.Validation.RequiredFields') });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Update.Validation.InvalidEmailFormat') });
  }

  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Update.Validation.PhoneMustBe11Digits') });
  }

  next();
};

export const validateCustomerId = (req, res, next) => {
  const { customerId } = req.params;

  if (!customerId || isNaN(customerId) || parseInt(customerId) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Customer.Id.Validation.InvalidCustomerId') });
  }

  next();
};

export const validateOrderCreate = (req, res, next) => {
  const { customer_id, total_amount, items } = req.body;

  if (!customer_id || !total_amount || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.RequiredFields') });
  }

  if (isNaN(customer_id) || parseInt(customer_id) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.ValidCustomerIdRequired') });
  }

  if (isNaN(total_amount) || parseFloat(total_amount) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.TotalAmountPositive') });
  }

  for (const item of items) {
    if (!item.product_id || !item.quantity || !item.unit_price) {
      return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.ItemFieldsRequired') });
    }

    if (isNaN(item.product_id) || parseInt(item.product_id) <= 0) {
      return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.ProductIdPositive') });
    }

    if (isNaN(item.quantity) || parseInt(item.quantity) <= 0) {
      return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.QuantityPositive') });
    }

    if (isNaN(item.unit_price) || parseFloat(item.unit_price) <= 0) {
      return res.status(400).json({ message: getMessage('Validation.Order.Create.Validation.UnitPricePositive') });
    }
  }

  next();
};

export const validateOrderId = (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId || isNaN(orderId) || parseInt(orderId) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Order.Id.Validation.InvalidOrderId') });
  }

  next();
};

export const validateOrderItemCreate = (req, res, next) => {
  const { order_id, product_id, quantity, unit_price } = req.body;

  if (!order_id || !product_id || !quantity || !unit_price) {
    return res.status(400).json({ message: getMessage('Validation.OrderItem.Create.Validation.RequiredFields') });
  }

  if (isNaN(order_id) || parseInt(order_id) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.OrderItem.Create.Validation.ValidOrderIdRequired') });
  }

  if (isNaN(product_id) || parseInt(product_id) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.OrderItem.Create.Validation.ValidProductIdRequired') });
  }

  if (isNaN(quantity) || parseInt(quantity) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.OrderItem.Create.Validation.QuantityPositive') });
  }

  if (isNaN(unit_price) || parseFloat(unit_price) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.OrderItem.Create.Validation.UnitPricePositive') });
  }

  next();
};

export const validateOrderItemId = (req, res, next) => {
  const { orderItemId } = req.params;

  if (!orderItemId || isNaN(orderItemId) || parseInt(orderItemId) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.OrderItem.Id.Validation.InvalidOrderItemId') });
  }

  next();
};

export const validatePaymentCreate = (req, res, next) => {
  const { order_id, payment_method, payment_amount } = req.body;

  if (!order_id || !payment_method || !payment_amount) {
    return res.status(400).json({ message: getMessage('Validation.Payment.Create.Validation.RequiredFields') });
  }

  if (isNaN(order_id) || parseInt(order_id) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Payment.Create.Validation.ValidOrderIdRequired') });
  }

  const validMethods = ['Cash on Delivery', 'bKash', 'Card', 'SSLCommerz'];
  if (!validMethods.includes(payment_method)) {
    return res.status(400).json({ message: getMessage('Validation.Payment.Create.Validation.PaymentMethodAllowed') });
  }

  if (isNaN(payment_amount) || parseFloat(payment_amount) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Payment.Create.Validation.PaymentAmountPositive') });
  }

  next();
};

export const validatePaymentId = (req, res, next) => {
  const { paymentId } = req.params;

  if (!paymentId || isNaN(paymentId) || parseInt(paymentId) <= 0) {
    return res.status(400).json({ message: getMessage('Validation.Payment.Id.Validation.InvalidPaymentId') });
  }

  next();
};

export const validateNotificationCreate = (req, res, next) => {
  const { title, message, customer_id, vendor_id } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: getMessage('Validation.Notification.Create.Validation.RequiredFields') });
  }

  if (!customer_id && !vendor_id) {
    return res.status(400).json({ message: getMessage('Validation.Notification.Create.Validation.RecipientRequired') });
  }

  if (typeof title !== 'string' || title.length === 0 || title.length > 255) {
    return res.status(400).json({ message: getMessage('Validation.Notification.Create.Validation.TitleNonEmpty') });
  }

  if (typeof message !== 'string' || message.length === 0) {
    return res.status(400).json({ message: getMessage('Validation.Notification.Create.Validation.MessageNonEmpty') });
  }

  if (customer_id && (isNaN(customer_id) || parseInt(customer_id) <= 0)) {
    return res.status(400).json({ message: getMessage('Validation.Notification.Create.Validation.ValidCustomerIdRequired') });
  }

  if (vendor_id && (isNaN(vendor_id) || parseInt(vendor_id) <= 0)) {
    return res.status(400).json({ message: getMessage('Validation.Notification.Create.Validation.ValidVendorIdRequired') });
  }

  next();
};

export const validateNotificationId = (req, res, next) => {
  const { notificationId } = req.params;

  if (!notificationId || isNaN(notificationId) || parseInt(notificationId) <= 0) {
    return res.status(400).json({ message: 'Valid notification ID (positive number) is required' });
  }

  next();
};
