import API from "./axiosConfig";

// Save token & user in localStorage
const saveUserSession = (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Remove token & user from localStorage
const clearUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Login API
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  saveUserSession(response.data.user, response.data.token);
  return response.data.user;
};

// Signup API
export const signupUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  saveUserSession(response.data.user, response.data.token);
  return response.data.user;
};

// Logout (clear session)
export const logoutUser = () => {
  clearUserSession();
};
