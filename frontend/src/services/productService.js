import api from './api.js';

export const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Add product fields
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          productData[key].forEach(file => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      
      // Add product fields
      Object.keys(productData).forEach(key => {
        if (key === 'images' || key === 'newImages') {
          if (productData[key] && productData[key].length > 0) {
            productData[key].forEach(file => {
              formData.append('images', file);
            });
          }
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's products
  getUserProducts: async () => {
    try {
      const response = await api.get('/products/user/my-products');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    try {
      const params = { search: query, ...filters };
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 6) => {
    try {
      const response = await api.get('/products', { 
        params: { limit, featured: true } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await api.get('/products', { 
        params: { categoryId, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
