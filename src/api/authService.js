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

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  const user = response.data.user;
  console.log(user)

  if (user.role === "client") {
    if (user.approvalStatus === "pending") {
      throw new Error(
        "Your account is pending approval. Please wait for admin approval."
      );
    }
    if (user.approvalStatus === "rejected") {
      throw new Error("Your account has been rejected. Contact support.");
    }
  }

  saveUserSession(user, response.data.token);
  return user;
};

// Signup API
export const signupUser = async (userData) => {
  try {
    console.log("Sending request with data:", userData);
    const response = await API.post("/auth/register", userData);
    console.log("Signup response:", response.data);

    // Ensure response contains expected data
    if (!response.data.user || !response.data.token) {
      throw new Error("Invalid response from server");
    }

    saveUserSession(response.data.user, response.data.token);
    return response.data.user;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};


// Logout (clear session)
export const logoutUser = () => {
  clearUserSession();
};
