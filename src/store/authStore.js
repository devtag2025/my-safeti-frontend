import { create } from "zustand";
import { loginUser, signupUser, logoutUser } from "../api/authService";
import { getCurrentUser } from "../api/userService";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,

  fetchUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null });
      localStorage.removeItem("user");
    }
  },

  login: async (credentials) => {
    const user = await loginUser(credentials);
    set({ user });
    localStorage.setItem("user", JSON.stringify(user)); // ✅ Store in localStorage
  },

  signup: async (userData) => {
    const user = await signupUser(userData);
    set({ user });
    localStorage.setItem("user", JSON.stringify(user)); // ✅ Store in localStorage
  },

  logout: () => {
    logoutUser();
    set({ user: null });
    localStorage.removeItem("user"); // ✅ Clear user from localStorage
  },

  isAdmin: () => useAuthStore.getState().user?.role === "admin",
  isClient: () => useAuthStore.getState().user?.role === "client",
}));

export default useAuthStore;
