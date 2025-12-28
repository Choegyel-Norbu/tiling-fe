/**
 * API Service
 * Handles all API communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

/**
 * Generic API request helper
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('jwt_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle non-200 status codes
    if (!response.ok) {
      // Handle Unauthorized (401) or Forbidden (403)
      if (response.status === 401 || response.status === 403) {
        authStorage.clear();
        window.location.href = '/'; // Redirect to home/login
        return;
      }
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Sign in with Google ID token
   * @param {string} idToken - Google ID token
   * @returns {Promise} API response with JWT token and user data
   */
  async googleSignIn(idToken) {
    return apiRequest('/auth/google-signin', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  /**
   * Get current authenticated user
   * @returns {Promise} API response with user data
   */
  async getCurrentUser() {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
};

/**
 * Booking API
 */
export const bookingAPI = {
  /**
   * Create a new booking with file uploads
   * @param {FormData} formData - FormData object containing booking fields and files
   * @returns {Promise} API response with booking data
   */
  async createBooking(formData) {
    const token = authStorage.getToken();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && data.error?.details) {
          const errorMessages = Object.values(data.error.details).join(', ');
          throw new Error(errorMessages || data.error?.message || 'Validation failed');
        }
        // Handle unauthorized
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Booking creation failed:', error);
      throw error;
    }
  },

  async getBookings() {
    return apiRequest('/bookings', {
      method: 'GET',
    });
  },

  /**
   * Get current user's bookings
   * @returns {Promise} API response with user's bookings (paginated)
   */
  async getMyBookings() {
    return apiRequest('/bookings/my-bookings', {
      method: 'GET',
    });
  },

  /**
   * Update a booking
   * @param {string} bookingId - Booking ID to update
   * @param {Object} updateData - Fields to update (date, timeSlot, description, suburb, postcode, jobSize, phone)
   * @returns {Promise} API response with updated booking data
   */
  async updateBooking(bookingId, updateData) {
    return apiRequest(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Update booking status (Admin only)
   * @param {string|number} bookingId - Booking ID to update
   * @param {string} status - New status ("pending" | "confirmed" | "completed" | "cancelled")
   * @param {string} notes - Optional notes for the status change
   * @returns {Promise} API response with updated booking data
   */
  async updateBookingStatus(bookingId, status, notes = null) {
    const body = { status };
    if (notes) {
      body.notes = notes;
    }
    return apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * Get blocked dates (Admin only)
   * @returns {Promise} API response with blocked dates array
   */
  async getBlockedDates() {
    return apiRequest('/bookings/block-dates', {
      method: 'GET',
    });
  },
};

/**
 * Helper to store authentication tokens
 */
export const authStorage = {
  setToken(token) {
    localStorage.setItem('jwt_token', token);
  },

  getToken() {
    return localStorage.getItem('jwt_token');
  },

  removeToken() {
    localStorage.removeItem('jwt_token');
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  clear() {
    this.removeToken();
    this.removeUser();
  },
};

export default apiRequest;

