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

export const getUserReportStats = async () => {
  try {
    const response = await API.get("/report/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching report stats:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const filterReports = async (filters) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/report/filter?${queryParams}`);
    return response.data.reports;
  } catch (error) {
    console.error("Error filtering reports:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};




export const updateReport = async (reportId, updateData) => {
  try {
    const response = await API.put(`/report/${reportId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating report:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};


export const deleteReport = async (reportId) => {
  try {
    const response = await API.delete(`/report/${reportId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting report:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};
