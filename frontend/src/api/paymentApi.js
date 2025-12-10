const axiosClient = require("./axiosClient");

const paymentApi = {
  createSession: (data) => axiosClient.post("/api/payment/create-session", data),
};

module.exports = paymentApi;
