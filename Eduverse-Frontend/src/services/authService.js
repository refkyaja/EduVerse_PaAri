const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Helper to get authorization headers with Sanctum Bearer token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('eduverse_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const authService = {
  /**
   * Register a new user in Laravel Backend
   */
  async register(data) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMsg = result.message || 'Registrasi gagal';
      const errors = result.errors ? Object.values(result.errors).flat().join(', ') : '';
      throw new Error(errors ? `${errorMsg}: ${errors}` : errorMsg);
    }

    if (result.data?.token) {
      localStorage.setItem('eduverse_token', result.data.token);
      localStorage.setItem('eduverse_user', JSON.stringify(result.data.user));
    }

    return result;
  },

  /**
   * Login user in Laravel Backend
   */
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMsg = result.message || 'Login gagal';
      const errors = result.errors ? Object.values(result.errors).flat().join(', ') : '';
      throw new Error(errors ? `${errorMsg}: ${errors}` : errorMsg);
    }

    if (result.data?.token) {
      localStorage.setItem('eduverse_token', result.data.token);
      localStorage.setItem('eduverse_user', JSON.stringify(result.data.user));
    }

    return result;
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Gagal mengambil data user');
    }

    if (result.data) {
      localStorage.setItem('eduverse_user', JSON.stringify(result.data));
    }

    return result.data;
  },

  /**
   * Update current user profile in backend
   */
  async updateProfile(profileData) {
    const token = this.getToken();
    if (!token) {
      const current = this.getStoredUser() || {};
      const updated = { ...current, ...profileData };
      localStorage.setItem('eduverse_user', JSON.stringify(updated));
      return updated;
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Gagal memperbarui profil di server');
    }

    if (result.data) {
      localStorage.setItem('eduverse_user', JSON.stringify(result.data));
    }

    return result.data;
  },

  /**
   * Logout user from Laravel Backend
   */
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('eduverse_token');
      localStorage.removeItem('eduverse_user');
    }
  },

  /**
   * Get stored local user
   */
  getStoredUser() {
    const raw = localStorage.getItem('eduverse_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem('eduverse_token');
  }
};
