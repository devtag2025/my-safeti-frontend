import API from "./axiosConfig";

// ✅ Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await API.get("/user/all");
    return response.data;
  } catch (error) {
    throw new Error("Failed to load users");
  }
};

// ✅ Update Client Approval Status (Approve/Reject)
export const updateClientStatus = async (userId, status) => {
  try {
    const response = await API.put(`/user/client-status/${userId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update client status: ${error.message}`);
  }
};
