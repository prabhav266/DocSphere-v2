import { apiClient } from "./apiClient";

export const authService = {
  login: async (email, password) => {
    return await apiClient.post("/auth/login", {
      email,
      password,
    });
  },

  register: async (userData) => {
    return await apiClient.post("/auth/register", {
      username: userData.fullName,
      email: userData.email,
      password: userData.password,
    });
  },

  updateProfile: async (id, data) => {
    return await apiClient.patch(`/users/${id}`, data);
  },
};