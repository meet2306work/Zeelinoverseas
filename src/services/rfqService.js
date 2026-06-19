import apiClient from './apiClient';

export const rfqService = {
  submitRfq: async (rfqData) => {
    // Multi-part form support for drawing file attachments
    const headers = rfqData.file ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/rfq', rfqData, { headers });
    return response.data;
  },

  getRfqs: async (params = {}) => {
    const response = await apiClient.get('/rfq', { params });
    return response.data;
  },

  getRfqById: async (id) => {
    const response = await apiClient.get(`/rfq/${id}`);
    return response.data;
  },

  submitQuoteBid: async (rfqId, bidData) => {
    const response = await apiClient.post(`/rfq/${rfqId}/bid`, bidData);
    return response.data;
  },
};

export default rfqService;
