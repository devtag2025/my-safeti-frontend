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

// Fetch all reports for the current user
export const getUserReports = async () => {
  try {
    const response = await API.get("/report");
    return response.data.reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error.response?.data || error;
  }
};

export const getAllReports = async () => {
  try {
    const response = await API.get("/report/all");
    return response.data.reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error.response?.data || error;
  }
};

