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
      const response = await api.post('/cart', { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      const cart = await this.getCart();
      return cart.itemCount || 0;
    } catch (error) {
      return 0;
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
