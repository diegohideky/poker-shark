// utils/axiosConfig.ts

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors if needed
// axiosInstance.interceptors.request.use(config => {
//   // Add any request interceptors here
//   return config;
// });

// axiosInstance.interceptors.response.use(response => {
//   // Handle responses globally
//   return response;
// });

export default axiosInstance;
