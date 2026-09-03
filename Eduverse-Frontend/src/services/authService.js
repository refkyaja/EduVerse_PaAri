const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('eduverse_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const authService = {
  async register(data) {
    try {
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
    } catch (err) {
      if (err.name === 'TypeError' || (err.message && err.message.includes('fetch'))) {
        throw new Error('Gagal terhubung ke server backend Laravel. Pastikan server backend (http://127.0.0.1:8000) sedang berjalan.');
      }
      throw err;
    }
  },

  async login(credentials) {
    try {
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
    } catch (err) {
      if (err.name === 'TypeError' || (err.message && err.message.includes('fetch'))) {
        throw new Error('Gagal terhubung ke server backend Laravel. Pastikan server backend (http://127.0.0.1:8000) sedang berjalan.');
      }
      throw err;
    }
  },

  async getProfile() {
    try {
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
    } catch (err) {
      if (err.name === 'TypeError' || (err.message && err.message.includes('fetch'))) {
        const stored = this.getStoredUser();
        if (stored) return stored;
        throw new Error('Gagal terhubung ke server backend Laravel.');
      }
      throw err;
    }
  },

  async updateProfile(profileData) {
    const token = this.getToken();
    if (!token) {
      const current = this.getStoredUser() || {};
      const updated = { ...current, ...profileData };
      localStorage.setItem('eduverse_user', JSON.stringify(updated));
      return updated;
    }

    try {
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
    } catch (err) {
      if (err.name === 'TypeError' || (err.message && err.message.includes('fetch'))) {
        const current = this.getStoredUser() || {};
        const updated = { ...current, ...profileData };
        localStorage.setItem('eduverse_user', JSON.stringify(updated));
        return updated;
      }
      throw err;
    }
  },

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
      localStorage.removeItem('eduquest_state');
      localStorage.removeItem('eduverse_classes');
      localStorage.removeItem('eduverse_user_classes');
      localStorage.removeItem('eduverse_materi');
      localStorage.removeItem('eduverse_quizzes');
    }
  },

  getStoredUser() {
    const raw = localStorage.getItem('eduverse_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('eduverse_token');
  }
};
