// src/api/authApi.js
import axiosClient from "./axiosClient";

const BASE_URL = "http://localhost:5000/api/auth";

export const authApi = {
  login: (email, password) => axiosClient.post("/auth/login", { email, password }),

  register: (data) => axiosClient.post("/auth/register", data),

  getMe: () => axiosClient.get("/auth/me"),

  updateProfile: (formData) =>
    axiosClient.put("/auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // ------------------------------
  // Policies functions
  // ------------------------------
  getUserById: (id) => axiosClient.get(`${BASE_URL}/${id}`), // fetch user by ID
  updatePolicies: (id, policies) => axiosClient.put(`${BASE_URL}/${id}/policies`, {
    insurance: policies.insurance,
    cancellation: policies.cancellation,
    additionalRules: policies.additionalRules,
  }),


  googleLogin: (data) => axiosClient.post("/auth/google-login", data),
  getFavorites: () => axiosClient.get("/wishlist"),
  toggleFavorite: (carId) => axiosClient.post(`/wishlist/${carId}`),
};
