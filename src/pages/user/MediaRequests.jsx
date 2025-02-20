import { useState, useEffect } from "react";
import useMediaRequestStore from "../../store/mediaRequestStore";
import UploadIcon from "../../assets/svgs/uploadIcon";

const MediaRequests = () => {
  const { mediaRequests, fetchUserRequests, uploadMedia } =
    useMediaRequestStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [files, setFiles] = useState([]); // Track multiple files
  const [isUploading, setIsUploading] = useState(false);
  const [fileErrors, setFileErrors] = useState([]); // To hold errors related to files

  const SUPPORTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mov",
    "video/avi",
    "image/webp",
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 10;

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const errors = [];

    // Validate the selected files
    selectedFiles.forEach((file) => {
      // Check if the file is larger than 5MB
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} is too large. Max file size is 5MB.`);
      }

      // Check if the file type is supported
      if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name} has an unsupported file type.`);
      }
    });

    // Check if the number of files exceeds 10
    if (files.length + selectedFiles.length > MAX_FILES) {
      errors.push(`You can upload a maximum of ${MAX_FILES} files.`);
    }

    if (errors.length === 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Add valid files to the list
    }

    setFileErrors(errors); // Set errors if any
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove file from the list
  };

  const handleUpload = async () => {
    if (!files.length || !selectedRequest) return;

    setIsUploading(true);
    const formData = new FormData();

    // Append each file to form data
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadMedia(selectedRequest._id, formData);
      setSelectedRequest(null);
      setFiles([]); // Reset file list
      fetchUserRequests();
    } catch (error) {
      console.error("Error uploading media:", error.message);
      alert("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Media Requests</h2>

      {mediaRequests.length === 0 ? (
        <p className="text-gray-500 text-center">No media requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaRequests
            .filter((request) => request.status !== "approved") // ✅ Hide approved requests
            .map((request) => (
              <div
                key={request._id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <h5 className="mb-2 text-xl font-bold text-gray-900">
                  {request.report.incidentType}
                </h5>
                {request.report.vehicleRegistration && (
                  <p className="mb-3 text-sm text-gray-600">
                    Vehicle Registration:{" "}
                    <span className="font-medium">
                      {request.report.vehicleRegistration}
                    </span>
                  </p>
                )}
                {request.report.location && (
                  <p className="mb-3 text-sm text-gray-600">
                    Location:{" "}
                    <span className="font-medium">
                      {request.report.location}
                    </span>
                  </p>
                )}
                {request.report.description && (
                  <p className="mb-3 text-sm text-gray-600">
                    Description:{" "}
                    <span className="font-medium">
                      {request.report.description}
                    </span>
                  </p>
                )}

                {/* ✅ Status Handling */}
                {request.status === "uploaded" ? (
                  <p className="text-sm font-semibold text-blue-600">
                    Media Submitted
                  </p>
                ) : request.status === "rejected" ? (
                  <p className="text-sm font-semibold text-red-600">
                    Previous upload rejected. Please upload again.
                  </p>
                ) : (
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-3 py-2 outline-none rounded w-max cursor-pointer"
                  >
                    <UploadIcon /> Upload Media
                  </button>
                )}
              </div>
            ))}
        </div>
      )}

      {/* 🔥 Upload Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Upload Media
            </h3>

            {/* ✅ Clickable upload area (opens file explorer only inside modal) */}
            <div
              onClick={() => document.getElementById("uploadFiles").click()}
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto"
            >
              <UploadIcon className="w-11 mb-2 fill-gray-500" />
              Upload files
              <input
                type="file"
                id="uploadFiles"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <p className="text-xs font-medium text-gray-400 mt-2">
                PNG, JPG, SVG, WEBP, GIF, MP4, MOV, and more are allowed.
              </p>
            </div>

            {/* ✅ Show selected files with the option to remove */}
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Selected Files
                </h4>
                <ul className="space-y-2 mt-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show error messages */}
            {fileErrors.length > 0 && (
              <div className="mt-4 text-sm text-red-600">
                <ul>
                  {fileErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaRequests;
