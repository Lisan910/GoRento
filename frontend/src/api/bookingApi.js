import axiosClient from "./axiosClient";

export const bookingApi = {
  checkAvailability: (data) => axiosClient.post("/bookings/check", data),
  create: (data) => axiosClient.post("/bookings", data),
  getUserBookings: () => axiosClient.get("/bookings/user"),
  getOwnerBookings: () => axiosClient.get("/bookings/owner"),
  updateStatus: (bookingId, status) => axiosClient.patch(`/bookings/${bookingId}/status`, { status }),
};


