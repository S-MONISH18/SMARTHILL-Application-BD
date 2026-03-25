const BASE_URL = 'http://10.0.2.2:3000';

//////////////////////////////////////////////////////
// 🔥 COMMON REQUEST
//////////////////////////////////////////////////////
const request = async (endpoint, method = 'GET', body = null) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error('API ERROR:', error);

    if (error.name === 'AbortError') {
      return { success: false, message: 'Request timeout' };
    }

    return {
      success: false,
      message: 'Network error. Check backend.',
    };
  }
};

//////////////////////////////////////////////////////
// 🔐 AUTH
//////////////////////////////////////////////////////

export const createUser = async (user) => {
  return request('/signup', 'POST', user);
};

export const loginUser = async (phone, password) => {
  return request('/login', 'POST', { phone, password });
};

//////////////////////////////////////////////////////
// 🚜 TRACTOR BOOKING
//////////////////////////////////////////////////////

export const bookTractor = async (data) => {
  return request('/book-tractor', 'POST', data);
};

export const getBookings = async (phone) => {
  return request(`/bookings/${phone}`);
};

export const getOwnerRequests = async (owner) => {
  return request(`/owner-requests/${owner}`);
};

export const updateBookingStatus = async (bookingId, status) => {
  return request('/update-booking', 'POST', {
    bookingId,
    status,
  });
};

//////////////////////////////////////////////////////
// � TRACTOR REGISTRATION
//////////////////////////////////////////////////////

export const registerTractor = async (tractor) => {
  return request('/register-tractor', 'POST', tractor);
};

export const getTractors = async (phone) => {
  return request(`/tractors/${phone}`);
};

//////////////////////////////////////////////////////
// �🛒 PRODUCT BUY (🔥 ADD THIS)
//////////////////////////////////////////////////////

// ✅ Customer buy product
export const buyProduct = async (data) => {
  return request('/buy-product', 'POST', data);
};

// ✅ Customer orders
export const getOrders = async (phone) => {
  return request(`/orders/${phone}`);
};

// ✅ Farmer order requests
export const getFarmerOrders = async (farmer) => {
  return request(`/farmer-orders/${farmer}`);
};

// ✅ Accept / Reject order
export const updateOrderStatus = async (orderId, status) => {
  return request('/update-order', 'POST', {
    orderId,
    status,
  });
};

//////////////////////////////////////////////////////
// 🔔 NOTIFICATIONS
//////////////////////////////////////////////////////

export const getNotifications = async (userId) => {
  return request(`/notifications/${userId}`);
};

//////////////////////////////////////////////////////
// 👤 USERS (OPTIONAL)
//////////////////////////////////////////////////////

export const getUsers = async () => {
  return request('/users');
};