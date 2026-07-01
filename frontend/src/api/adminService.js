import { apiClient } from "./apiClient";

const adminService = {
  getPendingUsers: async () => {
    return apiClient.get("/admin/users/pending");
  },

  approveUser: async (id) => {
    return apiClient.put(`/admin/users/${id}/approve`);
  },

  rejectUser: async (id) => {
    return apiClient.delete(`/admin/users/${id}/reject`);
  },

  getPendingDocuments: async () => {
    return apiClient.get("/admin/documents/pending");
  },

  approveDocument: async (id) => {
    return apiClient.put(`/admin/documents/${id}/approve`);
  },

  rejectDocument: async (id, reason = "") => {
    return apiClient.put(`/admin/documents/${id}/reject`, {
      reason,
    });
  },
};

export default adminService;