// API host settings (pick the option that matches your device environment)
// 1) Android emulator (default Android emulator): 10.0.2.2
// 2) USB physical device with adb reverse: localhost
//    adb reverse tcp:3000 tcp:3000
// 3) Physical device on same Wi-Fi: use your computer IP e.g. 192.168.x.y

const API_HOSTS = {
  emulator: 'http://10.0.2.2:3000',
  local: 'http://localhost:3000',
  lan: 'http://192.168.1.100:3000', // CHANGE THIS to your PC IP if not using adb reverse
};

// Set this to the correct host for your current dev run.
// For your current setup (physical device + adb reverse): use 'local'.
const BASE_URL = API_HOSTS.local;

//////////////////////////////////////////////////////
// 🔥 COMMON REQUEST
//////////////////////////////////////////////////////
const request = async (endpoint, method = 'GET', body = null, timeoutMs = 30000) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
      console.error('API 404/500:', {
        endpoint,
        method,
        status: response.status,
        body: data,
      });
      return {
        success: false,
        message: data.message || `Error ${response.status}`,
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    const info = {
      endpoint,
      method,
      BASE_URL,
      timeoutMs,
      message: error?.message,
      name: error?.name,
      type: error?.type,
      stack: error?.stack,
    };

    console.error('API ERROR:', info);

    if (error?.name === 'AbortError' || error?.type === 'aborted') {
      return { success: false, message: 'Request timeout. Try again.' };
    }

    return {
      success: false,
      message:
        'Network error. Check backend or internet connection. Confirm backend is reachable at ' +
        BASE_URL,
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
export const deleteBooking = async (bookingId) => {
  if (!bookingId) {
    console.warn('deleteBooking called without bookingId');
    return { success: false, message: 'Missing bookingId' };
  }

  // Try POST first (supported on backend)
  const result = await request('/delete-booking', 'POST', {
    bookingId,
  });

  if (result.success || result.status !== 404) {
    return result;
  }

  // Fallback for DELETE path if missing POST support
  return request(`/delete-booking/${encodeURIComponent(bookingId)}`, 'DELETE');
};
//////////////////////////////////////////////////////
// � TRACTOR REGISTRATION
//////////////////////////////////////////////////////

export const registerTractor = async (tractor) => {
  return request('/register-tractor', 'POST', tractor);
};

export const getAvailableTractors = async () => {
  return request('/tractors');
};

export const getTractors = async (phone) => {
  const response = await request('/tractors');
  if (response.success && Array.isArray(response.data) && phone) {
    return {
      success: true,
      data: response.data.filter(item => item.ownerPhone === phone),
    };
  }
  return response;
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
  const query = encodeURIComponent(farmer || '');
  return request(`/farmer-orders?farmer=${query}`);
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
// � PRODUCTS
//////////////////////////////////////////////////////

export const addProduct = async (product) => {
  return request('/products', 'POST', product);
};

export const getProducts = async () => {
  return request('/products', 'GET');
};

//////////////////////////////////////////////////////
// �👤 USERS (OPTIONAL)
//////////////////////////////////////////////////////

export const getUsers = async () => {
  return request('/users');
};