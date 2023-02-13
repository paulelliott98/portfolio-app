var axios = require("axios");
var axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/high-score"
      : "https://www.paulgan.com/high-score",
  timeout: 1000,
});

module.exports = axiosInstance;
