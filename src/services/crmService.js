import apiClient from './apiClient';

export const crmService = {
  getLeads: async (params = {}) => {
    const response = await apiClient.get('/crm/leads', { params });
    return response.data;
  },

  getLeadById: async (id) => {
    const response = await apiClient.get(`/crm/leads/${id}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await apiClient.post('/crm/leads', leadData);
    return response.data;
  },

  updateLeadStage: async (id, stage) => {
    const response = await apiClient.patch(`/crm/leads/${id}/stage`, { stage });
    return response.data;
  },
};

export default crmService;
