import API from "./axiosConfig";

export const fetchUserRequests = async () => {
  try {
    const response = await API.get("/media-requests");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user media requests:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load media requests."
    );
  }
};

export const fetchClientRequests = async () => {
  try {
    const response = await API.get("/media-requests/client");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching client media requests:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load media requests."
    );
  }
};

export const fetchPendingUploads = async () => {
  try {
    const response = await API.get("/media-requests/pending");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching pending media uploads:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load pending media requests."
    );
  }
};

export const requestMedia = async (reportId) => {
  try {
    const response = await API.post("/media-requests/request", { reportId });
    return response.data;
  } catch (error) {
    console.error(
      "Error requesting media:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to request media."
    );
  }
};

export const uploadMedia = async (requestId, file) => {
  try {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    console.log(formData.get("file"));

    const response = await API.post(
      `/media-requests/upload/${requestId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error uploading media:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to upload media.");
  }
};

export const changeMediaStatus = async (requestId, status) => {
  try {
    const response = await API.patch(`/media-requests/${requestId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error changing media status to ${status}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to change media status."
    );
  }
};
