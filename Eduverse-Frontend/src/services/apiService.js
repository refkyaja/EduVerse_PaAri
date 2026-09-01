const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('eduverse_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const apiService = {
  // --- KELAS & PENGATURAN ---
  async getClass(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    return result.data;
  },

  async updateClass(classId, data) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal memperbarui informasi kelas');
    }
    return result.data;
  },

  async regenerateClassCode(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/regenerate-code`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal meregenerasi kode kelas');
    }
    return result.data;
  },

  async deleteClass(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal menghapus kelas');
    }
    return result;
  },

  // --- KELOLA ANGGOTA & ADMIN ---
  async getMembers(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/members`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    return result.data || [];
  },

  async promoteMember(classId, userId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/members/${userId}/promote`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal mengangkat Admin');
    }
    return result.data;
  },

  async demoteAdmin(classId, userId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/members/${userId}/demote`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal mendemosi Admin');
    }
    return result.data;
  },

  async kickMember(classId, userId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/members/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal mengeluarkan anggota');
    }
    return result;
  },

  // --- MAPEL (MATA PELAJARAN) ---
  async getMapel(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/mapel`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    return result.data || [];
  },

  async createMapel(classId, data) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/mapel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal menambahkan mata pelajaran');
    }
    return result.data;
  },

  // --- MATERI & VERIFIKASI ---
  async getMateri(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/materi`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    return result.data || [];
  },

  async createMateri(classId, data) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/materi`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal membuat materi baru');
    }
    return result.data;
  },

  async verifyMateriVersi(classId, versiId, data) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/materi-versi/${versiId}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal memverifikasi materi');
    }
    return result.data;
  },

  // --- KUIS & BANK SOAL ---
  async getKuis(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/kuis`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    return result.data || [];
  },

  async createKuis(classId, data) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/kuis`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.status !== 'success') {
      throw new Error(result.message || 'Gagal menerbitkan kuis');
    }
    return result.data;
  },

  // --- LOG AKTIVITAS ---
  async getLogAktivitas(classId) {
    const res = await fetch(`${API_BASE_URL}/classes/${classId}/log-aktivitas`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    return result.data || [];
  },
};
