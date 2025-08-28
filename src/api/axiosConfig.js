import axios from "axios";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

// Create Axios instance with base config
const API = axios.create({
  // baseURL: "https://api.safestreet.com.au/api",
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }
     
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
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Something went wrong";

    if (status === 401) {
      // Logout user if token is invalid/expired
      useAuthStore.getState().logout();
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
      toast.error("Session expired. Please log in again.");
    } else if (status === 400) {
      toast.error(message || "Bad request");
    } else if (status === 403) {
      toast.error(message || "Forbidden");
    } else if (status === 404) {
      toast.error(message || "Not found");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;
