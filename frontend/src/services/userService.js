import api from './api.js';

export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's purchase history
  getOrderHistory: async () => {
    try {
      const response = await api.get('/users/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single order details
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/users/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update profile picture
  updateProfilePicture: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', imageFile);

      const response = await api.put('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/users/account', {
        data: { password }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
