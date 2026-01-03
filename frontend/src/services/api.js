const API_BASE_URL = import.meta.env.VITE_API_URL ;

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('API Request:', url);
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.message || 'Something went wrong');
    }

    console.log('API Success:', endpoint, data);
    return data;
  } catch (error) {
    console.error('API Error:', endpoint, error);
    throw error;
  }
};

export const customerAPI = {
  register: async (customerData) => {
    return apiRequest('/customers/register', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  login: async (email, password) => {
    return apiRequest('/customers/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getAll: async () => {
    return apiRequest('/customers');
  },

  getById: async (customerId) => {
    return apiRequest(`/customers/${customerId}`);
  },

  update: async (customerId, updateData) => {
    return apiRequest(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  delete: async (customerId) => {
    return apiRequest(`/customers/${customerId}`, {
      method: 'DELETE',
    });
  },
};

export const productAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return apiRequest(endpoint);
  },

  getById: async (productId) => {
    return apiRequest(`/products/${productId}`);
  },

  getBySeller: async (sellerId) => {
    return apiRequest(`/products/seller/${sellerId}`);
  },

  search: async (title, params = {}) => {
    const queryParams = new URLSearchParams({ title, ...params }).toString();
    return apiRequest(`/products/search?${queryParams}`);
  },

  create: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (productId, updateData) => {
    return apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  delete: async (productId) => {
    return apiRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
  },
};


export const vendorAPI = {
  getAll: async () => {
    return apiRequest('/vendors');
  },

  getById: async (vendorId) => {
    return apiRequest(`/vendors/${vendorId}`);
  },

  getByEmail: async (email) => {
    return apiRequest(`/vendors/email/${email}`);
  },

  getByPhone: async (phone) => {
    return apiRequest(`/vendors/phone/${phone}`);
  },

  getByType: async (shopType) => {
    return apiRequest(`/vendors/type/${shopType}`);
  },

  register: async (vendorData) => {
    return apiRequest('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  update: async (vendorId, updateData) => {
    return apiRequest(`/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  delete: async (vendorId) => {
    return apiRequest(`/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },
};

export const orderAPI = {
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getAll: async () => {
    return apiRequest('/orders');
  },

  getById: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  getByCustomer: async (customerId) => {
    return apiRequest(`/orders/customer/${customerId}`);
  },

  getByVendor: async (vendorId) => {
    return apiRequest(`/orders/vendor/${vendorId}`);
  },

  updateStatus: async (orderId, order_status) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ order_status }),
    });
  },

  updatePaymentStatus: async (orderId, payment_status) => {
    return apiRequest(`/orders/${orderId}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_status }),
    });
  },

  delete: async (orderId) => {
    return apiRequest(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },
};

export const orderItemAPI = {
  create: async (orderItemData) => {
    return apiRequest('/order-items', {
      method: 'POST',
      body: JSON.stringify(orderItemData),
    });
  },

  getAll: async () => {
    return apiRequest('/order-items');
  },

  getById: async (orderItemId) => {
    return apiRequest(`/order-items/${orderItemId}`);
  },

  getByOrderId: async (orderId) => {
    return apiRequest(`/order-items/order/${orderId}`);
  },

  getByProductId: async (productId) => {
    return apiRequest(`/order-items/product/${productId}`);
  },

  update: async (orderItemId, updateData) => {
    return apiRequest(`/order-items/${orderItemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  delete: async (orderItemId) => {
    return apiRequest(`/order-items/${orderItemId}`, {
      method: 'DELETE',
    });
  },
};


export const notificationAPI = {
  getByCustomer: async (customerId) => {
    return apiRequest(`/notifications/customer/${customerId}`);
  },

  markAsRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async (customerId) => {
    return apiRequest(`/notifications/customer/${customerId}/read-all`, {
      method: 'PATCH',
    });
  },

  delete: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

export default {
  customer: customerAPI,
  product: productAPI,
  vendor: vendorAPI,
  order: orderAPI,
  orderItem: orderItemAPI,
  notification: notificationAPI,
};
