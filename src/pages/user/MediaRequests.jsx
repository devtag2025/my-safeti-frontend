import { useState, useEffect } from "react";
import useMediaRequestStore from "../../store/mediaRequestStore";
import UploadIcon from "../../assets/svgs/uploadIcon";

const MediaRequests = () => {
  const { mediaRequests, fetchUserRequests, uploadMedia } =
    useMediaRequestStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return; // ✅ Prevent errors when canceling file selection

    setFile(uploadedFile);

    // ✅ Generate a preview for image files
    if (uploadedFile.type.startsWith("image/")) {
      const objectURL = URL.createObjectURL(uploadedFile);
      setPreviewURL(objectURL);
    } else {
      setPreviewURL(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedRequest) return;
    setIsUploading(true);
    try {
      await uploadMedia(selectedRequest._id, file);
      setSelectedRequest(null);
      setFile(null);
      setPreviewURL(null); // ✅ Clear preview after upload
      fetchUserRequests();
    } catch (error) {
      console.error("Error uploading media:", error.message);
      alert("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Reset Modal when Closing
  const closeModal = () => {
    setSelectedRequest(null);
    setFile(null);
    setPreviewURL(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Media Requests</h2>

      {mediaRequests.length === 0 ? (
        <p className="text-gray-500 text-center">No media requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaRequests
            .filter((request) => request.status !== "approved")
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
                    onClick={() => {
                      setSelectedRequest(request);
                      setFile(null);
                      setPreviewURL(null); // ✅ Reset file & preview when reopening modal
                    }}
                    className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-3 py-2 outline-none rounded w-max cursor-pointer"
                  >
                    <UploadIcon />
                    Upload Media
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

            {/* ✅ Clickable upload area */}
            <div
              onClick={() => document.getElementById("uploadFile").click()}
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto relative"
            >
              {previewURL ? (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <>
                  <UploadIcon className="w-11 mb-2 fill-gray-500" />
                  <p>Upload file</p>
                  <p className="text-xs font-medium text-gray-400 mt-2">
                    PNG, JPG, SVG, WEBP, and GIF are allowed.
                  </p>
                </>
              )}
              <input
                type="file"
                id="uploadFile"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* ✅ Show selected file name */}
            {file && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                Selected File: {file.name}
              </p>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
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
