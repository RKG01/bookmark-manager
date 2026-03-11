const API_BASE = '/api';

// Bookmarks API
export const bookmarksAPI = {
  getAll: async (categoryId = null, search = '') => {
    const params = new URLSearchParams();
    if (categoryId) params.append('category', categoryId);
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE}/bookmarks?${params}`);
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/bookmarks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch bookmark');
    return response.json();
  },

  create: async (bookmark) => {
    const response = await fetch(`${API_BASE}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Failed to create bookmark');
    }
    return response.json();
  },

  update: async (id, bookmark) => {
    const response = await fetch(`${API_BASE}/bookmarks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Failed to update bookmark');
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/bookmarks/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete bookmark');
    return response.json();
  },

  trackVisit: async (id) => {
    const response = await fetch(`${API_BASE}/visit/${id}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to track visit');
    return response.json();
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  create: async (category) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Failed to create category');
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
    return response.json();
  }
};
