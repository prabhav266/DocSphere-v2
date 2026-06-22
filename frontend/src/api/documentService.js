import { apiClient } from './apiClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const documentService = {
  getAll: async () => {
    return await apiClient.get('/documents');
  },

  getById: async (id) => {
    return await apiClient.get(`/documents/${id}`);
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

  search: async (query) => {
    return await apiClient.get(`/documents/search?q=${encodeURIComponent(query)}`);
  },

  getDownloadUrl: (id) => {
    return `${BASE_URL}/documents/${id}/download`;
  },
};
