
const API_BASE_URL = import.meta.env.VITE_API_URL ;

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  } else {
    // Let the browser set the multipart boundary
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.message || 'Something went wrong');
    }

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
      body:
        typeof FormData !== 'undefined' && customerData instanceof FormData
          ? customerData
          : JSON.stringify(customerData),
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
      body:
        typeof FormData !== 'undefined' && updateData instanceof FormData
          ? updateData
          : JSON.stringify(updateData),
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
      body:
        typeof FormData !== 'undefined' && productData instanceof FormData
          ? productData
          : JSON.stringify(productData),
    });
  },

  update: async (productId, updateData) => {
    return apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body:
        typeof FormData !== 'undefined' && updateData instanceof FormData
          ? updateData
          : JSON.stringify(updateData),
    });
  },

  delete: async (productId) => {
    return apiRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
  },
};


export const vendorAPI = {

  vendorLogin: async (email, password) => {
    return apiRequest('/vendors/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

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
      body:
        typeof FormData !== 'undefined' && vendorData instanceof FormData
          ? vendorData
          : JSON.stringify(vendorData),
    });
  },

  update: async (vendorId, updateData) => {
    return apiRequest(`/vendors/${vendorId}`, {
      method: 'PUT',
      body:
        typeof FormData !== 'undefined' && updateData instanceof FormData
          ? updateData
          : JSON.stringify(updateData),
    });
  },

  delete: async (vendorId) => {
    return apiRequest(`/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },
};

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminAPI = {
  login: async (email, password) => {
    return apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me: async () => {
    return apiRequest('/admin/auth/me', {
      headers: getAdminAuthHeaders(),
    });
  },

  getSummary: async () => {
    return apiRequest('/admin/dashboard/summary', {
      headers: getAdminAuthHeaders(),
    });
  },

  getConfiguration: async () => {
    return apiRequest('/admin/configuration', {
      headers: getAdminAuthHeaders(),
    });
  },

  updateConfiguration: async (payload) => {
    return apiRequest('/admin/configuration', {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    });
  },

  getCustomers: async () => {
    const response = await apiRequest('/admin/customers', {
      headers: getAdminAuthHeaders(),
    });
    return response.customers || [];
  },

  deleteCustomer: async (customerId) => {
    return apiRequest(`/admin/customers/${customerId}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
  },

  getVendors: async () => {
    const response = await apiRequest('/admin/vendors', {
      headers: getAdminAuthHeaders(),
    });
    return response.vendors || [];
  },

  deleteVendor: async (vendorId) => {
    return apiRequest(`/admin/vendors/${vendorId}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
  },

  getProducts: async () => {
    const response = await apiRequest('/admin/products', {
      headers: getAdminAuthHeaders(),
    });
    return response.products || [];
  },

  deleteProduct: async (productId) => {
    return apiRequest(`/admin/products/${productId}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
  },

  getOrders: async () => {
    const response = await apiRequest('/admin/orders', {
      headers: getAdminAuthHeaders(),
    });
    return response.orders || [];
  },

  deleteOrder: async (orderId) => {
    return apiRequest(`/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
  },

  getNotifications: async () => {
    const response = await apiRequest('/admin/notifications', {
      headers: getAdminAuthHeaders(),
    });
    return response.notifications || [];
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

  updateOrderStatus: async (orderId, order_status) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ order_status }),
    });
  },

  updatePaymentStatus: async (orderId, payment_status) => {
    return apiRequest(`/orders/${orderId}/payment-status`, {
      method: 'PUT',
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
  createNotification: async (notificationData) => {
    return apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },
  getByCustomer: async (customerId) => {
    return apiRequest(`/notifications/customer/${customerId}`);
  },
  getUnreadByCustomer: async (customerId) => {
    return apiRequest(`/notifications/customer/${customerId}/unread`);
  },
  getUnreadCountByCustomer: async (customerId) => {
    return apiRequest(`/notifications/customer/${customerId}/unread-count`);
  },

  getByVendor: async (vendorId) => {
    return apiRequest(`/notifications/vendor/${vendorId}`);
  },
  getUnreadByVendor: async (vendorId) => {
    return apiRequest(`/notifications/vendor/${vendorId}/unread`);
  },
  getUnreadCountByVendor: async (vendorId) => {
    return apiRequest(`/notifications/vendor/${vendorId}/unread-count`);
  },

  markAsRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAsUnread: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/unread`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async (customerId) => {
    return apiRequest(`/notifications/customer/${customerId}/read-all`, {
      method: 'PATCH',
    });
  },
  markAllAsReadVendor: async (vendorId) => {
    return apiRequest(`/notifications/vendor/${vendorId}/read-all`, {
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
