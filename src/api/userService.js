import API from "./axiosConfig";

// Fetch current user details
export const getCurrentUser = async () => {
    try {
        const response = await API.get("/user");
        return response.data; // Returns user object
    } catch (error) {
        console.error("Error fetching user:", error.response?.data?.message || error.message);
        throw error.response?.data || error;
    }
};

// Fetch all users (admin access required)
export const getAllUsers = async () => {
    try {
        const response = await API.get("/user/all");
        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error.response?.data?.message || error.message);
        throw error.response?.data || error;
    }
};

// Update user profile
export const updateUser = async (userData) => {
    try {
        const response = await API.patch("/user", userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error.response?.data?.message || error.message);
        throw error.response?.data || error;
    }
};
