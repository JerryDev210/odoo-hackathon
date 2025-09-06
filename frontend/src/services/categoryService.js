import api from './api.js';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single category
  getCategory: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get products by category
  getCategoryProducts: async (id, params = {}) => {
    try {
      const response = await api.get(`/categories/${id}/products`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
