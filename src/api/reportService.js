import API from "./axiosConfig";

export const createReport = async (reportData) => {
  try {
    const response = await API.post("/report", reportData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating report:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error; 
  }
};
