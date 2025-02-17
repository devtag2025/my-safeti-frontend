import { create } from "zustand";
import { loginUser, signupUser, logoutUser } from "../api/authService";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,

  login: async (credentials) => {
    const user = await loginUser(credentials);
    set({ user });
  },

  signup: async (userData) => {
    const user = await signupUser(userData);
    set({ user });
  },

  logout: () => {
    logoutUser();
    set({ user: null });
  },

  isAdmin: () => useAuthStore.getState().user?.role === "admin",
  isClient: () => useAuthStore.getState().user?.role === "client",
}));

export default useAuthStore;
