import api from './api.js';

export const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put('/cart/update', { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete('/cart/remove', {
        data: { productId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      const response = await api.get('/cart/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Checkout cart (create order)
  checkout: async (shippingAddress, paymentMethod = 'cash_on_delivery') => {
    try {
      const response = await api.post('/cart/checkout', {
        shippingAddress,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
