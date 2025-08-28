import { create } from "zustand";
import { loginUser, signupUser, logoutUser } from "../api/authService";
import { getCurrentUser } from "../api/userService";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: true, 

  fetchUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user, loading: false });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, loading: false });
      localStorage.removeItem("user");
    }
  },

  login: async (credentials) => {
    const user = await loginUser(credentials);
    set({ user, loading: false });
    localStorage.setItem("user", JSON.stringify(user));
  },

  signup: async (userData) => {
    const user = await signupUser(userData);
    set({ user, loading: false });
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    logoutUser();
    set({ user: null });
    localStorage.removeItem("user");
    
  },

  isSuperAdmin: () => useAuthStore.getState().user?.role === "super-admin",
  isAdmin: () => useAuthStore.getState().user?.role === "admin",
  isClient: () => useAuthStore.getState().user?.role === "client",
}));


export default useAuthStore;
