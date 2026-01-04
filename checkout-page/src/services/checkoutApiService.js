import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const checkoutApiService = {
  getOrder: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/orders/${orderId}/public`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPayment: async (orderId, paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/payments/public`, {
        order_id: orderId,
        ...paymentData,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPayment: async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/payments/${paymentId}/public`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
