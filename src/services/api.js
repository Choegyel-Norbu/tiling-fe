/**
 * API Service
 * Handles all API communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

/**
 * Custom event name for unauthorized/forbidden responses
 * AuthContext listens for this event to trigger proper logout
 */
export const AUTH_LOGOUT_EVENT = 'auth:logout';

/**
 * Dispatches the logout event when a 401 or 403 is received
 * This allows React components (AuthContext) to respond to unauthorized/forbidden API calls
 */
function dispatchLogoutEvent() {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
}

/**
 * Handles 401 (Unauthorized) and 403 (Forbidden) responses - clears storage and dispatches logout event
 */
function handleUnauthorized() {
  authStorage.clear();
  dispatchLogoutEvent();
}

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
        handleUnauthorized();
        throw new Error(response.status === 403 ? 'Access forbidden. Please sign in again.' : 'Session expired. Please sign in again.');
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
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${baseUrl}/bookings`, {
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
        // Handle unauthorized (401) or forbidden (403) - dispatch logout event
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          throw new Error(response.status === 403 ? 'Access forbidden. Please sign in again.' : 'Session expired. Please sign in again.');
        }
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Booking creation failed:', error);
      throw error;
    }
  },

  /**
   * Get all bookings (Admin only)
   * @param {number} page - Page number (0-indexed)
   * @param {number} limit - Number of items per page
   * @returns {Promise} API response with paginated bookings
   */
  async getBookings(page = 0, limit = 10) {
    return apiRequest(`/bookings?page=${page}&limit=${limit}`, {
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
   * @param {Object|FormData} updateData - Fields to update (date, timeSlot, description, suburb, postcode, jobSize, phone) or FormData with files
   * @param {boolean} isFormData - Whether updateData is FormData (for file uploads)
   * @returns {Promise} API response with updated booking data
   */
  async updateBooking(bookingId, updateData, isFormData = false) {
    const token = authStorage.getToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const config = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      if (isFormData) {
        // For FormData, don't set Content-Type - browser will set it with boundary
        config.body = updateData;
      } else {
        // For JSON
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(updateData);
      }

      const response = await fetch(`${baseUrl}/bookings/${bookingId}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && data.error?.details) {
          const errorMessages = Object.values(data.error.details).join(', ');
          throw new Error(errorMessages || data.error?.message || 'Validation failed');
        }
        // Handle unauthorized
        if (response.status === 401) {
          handleUnauthorized();
          throw new Error('Session expired. Please sign in again.');
        }
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Booking update failed:', error);
      throw error;
    }
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

  /**
   * Delete a booking by ID (Admin only)
   * @param {string|number} bookingId - Booking ID to delete
   * @returns {Promise} API response
   */
  async deleteBooking(bookingId) {
    return apiRequest(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * File Upload API
 * Handles file deletion operations
 */
export const fileAPI = {
  /**
   * Delete a single file by file key
   * @param {string} fileKey - The file key (filename) to delete
   * @returns {Promise} API response
   */
  async deleteFile(fileKey) {
    const token = authStorage.getToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${baseUrl}/v1/uploadthing/files/${fileKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          throw new Error(response.status === 403 ? 'Access forbidden. Please sign in again.' : 'Session expired. Please sign in again.');
        }
        throw new Error(data.error?.message || `Failed to delete file. Status: ${response.status}`);
      }

      // Some APIs return empty body on success
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error('File deletion failed:', error);
      throw error;
    }
  },

  /**
   * Delete multiple files by file keys
   * @param {string[]} fileKeys - Array of file keys (filenames) to delete
   * @returns {Promise} API response
   */
  async deleteFiles(fileKeys) {
    const token = authStorage.getToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

    if (!token) {
      throw new Error('Authentication required');
    }

    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
      throw new Error('File keys array is required and cannot be empty');
    }

    try {
      const response = await fetch(`${baseUrl}/v1/uploadthing/files`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileKeys),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          throw new Error(response.status === 403 ? 'Access forbidden. Please sign in again.' : 'Session expired. Please sign in again.');
        }
        throw new Error(data.error?.message || `Failed to delete files. Status: ${response.status}`);
      }

      // Some APIs return empty body on success
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error('Multiple file deletion failed:', error);
      throw error;
    }
  },
};

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  TOKEN: 'jwt_token',
  USER: 'user',
};

/**
 * In-memory fallback storage for browsers that block localStorage
 * (Safari private mode, some iOS settings, etc.)
 */
const memoryStorage = new Map();

/**
 * Checks if localStorage is available and working
 * Handles Safari private mode, iOS restrictions, Android WebView issues
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // localStorage not available (private mode, storage full, etc.)
    return false;
  }
}

/**
 * Safe storage wrapper that handles all browser edge cases
 */
const safeStorage = {
  setItem(key, value) {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage.set(key, value);
      }
    } catch (e) {
      // Fallback to memory if localStorage fails (quota exceeded, etc.)
      console.warn('localStorage write failed, using memory fallback:', e);
      memoryStorage.set(key, value);
    }
  },

  getItem(key) {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      }
      return memoryStorage.get(key) || null;
    } catch (e) {
      console.warn('localStorage read failed, using memory fallback:', e);
      return memoryStorage.get(key) || null;
    }
  },

  removeItem(key) {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      }
      memoryStorage.delete(key);
    } catch (e) {
      console.warn('localStorage remove failed:', e);
      memoryStorage.delete(key);
    }
  },

  clear() {
    try {
      // Only clear our app-specific keys, not all localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        if (isLocalStorageAvailable()) {
          localStorage.removeItem(key);
        }
        memoryStorage.delete(key);
      });
    } catch (e) {
      console.warn('localStorage clear failed:', e);
      memoryStorage.clear();
    }
  },
};

/**
 * Helper to store authentication tokens
 * Handles cross-browser compatibility (Chrome, Safari, iOS, Android)
 * Token remains valid until user explicitly logs out
 */
export const authStorage = {
  /**
   * Store token
   */
  setToken(token) {
    safeStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * Get token (valid until user logs out)
   */
  getToken() {
    return safeStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Check if token exists
   */
  isTokenValid() {
    return this.getToken() !== null;
  },

  removeToken() {
    safeStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  setUser(user) {
    safeStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser() {
    const user = safeStorage.getItem(STORAGE_KEYS.USER);
    if (!user) {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (e) {
      console.warn('Failed to parse user data:', e);
      return null;
    }
  },

  removeUser() {
    safeStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Clear all authentication data (called on logout)
   */
  clear() {
    safeStorage.clear();
  },
};

/**
 * Rating API
 */
export const ratingAPI = {
  /**
   * Submit a rating for a booking
   * @param {string} bookingId - Booking ID to rate
   * @param {number} rating - Rating value (1-10)
   * @param {string} comment - Optional comment
   * @returns {Promise} API response
   */
  async submitRating(bookingId, rating, comment = '') {
    return apiRequest(`/ratings/bookings/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({
        rating,
        comment: comment.trim() || undefined,
      }),
    });
  },
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  /**
   * Get notifications (Admin only)
   * @param {number} page - Page number (0-indexed)
   * @param {number} limit - Number of items per page
   * @returns {Promise} API response with paginated notifications
   */
  async getNotifications(page = 0, limit = 20) {
    return apiRequest(`/notifications?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  },

  /**
   * Mark a notification as read
   * @param {string|number} notificationId - Notification ID to mark as read
   * @returns {Promise} API response
   */
  async markAsRead(notificationId) {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },
};

export default apiRequest;

