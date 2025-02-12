import axios from "axios";
import useAuthStore from "../store/authStore";

// Create Axios instance with base config
const API = axios.create({
  baseURL: "http://localhost:3000/api", // Change this if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout user if token is invalid/expired
      useAuthStore.getState().logout();
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
