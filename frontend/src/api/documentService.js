import { apiClient } from './apiClient';
import { API_BASE_URL } from './apiClient';

export const documentService = {
  getAll: async () => {
    return await apiClient.get('/documents');
  },

  getById: async (id) => {
    return await apiClient.get(`/documents/${id}`);
  },

  getMine: async () => {
    return await apiClient.get('/documents/my');
  },

  getAnalytics: async () => {
    return await apiClient.get('/documents/analytics');
  },

  // Upload a real file with title, description, visibility
  upload: async (file, title, description, visibility = 'public') => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('visibility', visibility);
    return await apiClient.postForm('/documents/upload', formData);
  },

  delete: async (id) => {
    return await apiClient.delete(`/documents/${id}`);
  },

  search: async ({ query = '', type = 'All', visibility = 'all', dateRange = 'all', mine = false } = {}) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type && type !== 'All') params.set('type', type);
    if (visibility && visibility !== 'all') params.set('visibility', visibility);
    if (dateRange && dateRange !== 'all') params.set('dateRange', dateRange);
    if (mine) params.set('mine', 'true');
    return await apiClient.get(`/documents/search?${params.toString()}`);
  },

  createShareLink: async (id, expiresInDays = 7) => {
    return await apiClient.post(`/documents/${id}/share`, { expiresInDays });
  },

  getShared: async (token) => {
    return await apiClient.get(`/documents/shared/${token}`);
  },

  askQuestion: async (id, question) => {
    return await apiClient.post(`/chat/documents/${id}`, { question });
  },

  getDownloadUrl: (id) => {
    return `${API_BASE_URL}/documents/${id}/download`;
  },
};
