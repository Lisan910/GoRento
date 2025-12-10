import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/cars",
});

// Automatically add JWT token if it exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const carApi = {
  getAll: () => API.get("/"),        // gets all cars (owner: their cars; customer: all)
  get: (id) => API.get(`/${id}`),
  getRelated: (id) => API.get(`/${id}/related`),
  create: (data) => API.post("/", data),
  update: (id, data) => API.put(`/${id}`, data),
  remove: (id) => API.delete(`/${id}`),
  getOwnerCars: () => API.get("/owner"),
};
