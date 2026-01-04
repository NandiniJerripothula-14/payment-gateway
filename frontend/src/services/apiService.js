import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiService = {
  getMerchant: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/test/merchant`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPayments: async (apiKey, apiSecret) => {
    try {
      // For dashboard, we'll fetch from a hypothetical dashboard endpoint
      // For now, return empty array as payments are specific to orders
      return { payments: [] };
    } catch (error) {
      throw error;
    }
  },
};
