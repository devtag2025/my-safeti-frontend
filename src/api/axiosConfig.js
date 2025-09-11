import axios from "axios";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

// Create Axios instance with base config
const API = axios.create({
  baseURL: "https://api.safestreet.com.au/api",
  // baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }
     
    const csrfToken = localStorage.getItem("csrfToken");
    const method = (config.method || "get").toLowerCase();
    const isStateChanging = ["post", "put", "patch", "delete"].includes(method);
    if (isStateChanging && csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
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
      // Try refresh once
      if (!error.config.__isRetryRequest) {
        error.config.__isRetryRequest = true;
        return API.post("/auth/refresh", {}, { withCredentials: true })
          .then(() => API.request(error.config))
          .catch(() => {
            useAuthStore.getState().verifyRole().then((isValid) => {
              if (!isValid) {
                useAuthStore.getState().logout();
                toast.error("Session expired. Please log in again.");
                window.location.href = "/login";
              }
            });
          });
      }
      
      useAuthStore.getState().verifyRole().then((isValid) => {
        if (!isValid) {
          useAuthStore.getState().logout();
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        }
      });
    } else if (status === 403) {
      useAuthStore.getState().verifyRole();
      toast.error(message || "Access denied. Your role may have changed.");
    } else if (status === 400) {
      toast.error(message || "Bad request");
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
