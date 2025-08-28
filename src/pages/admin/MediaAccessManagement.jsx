import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Check,
  X,
  Eye,
  Film,
  Camera,
  Upload,
  Plus,
} from "lucide-react";
import axios from "axios";
import API from "../../api/axiosConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadMedia } from "../../api/mediaRequestService";
import { toast } from "react-hot-toast";

const MediaAccessManagement = () => {
  const [mediaRequests, setMediaRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedUploadRequest, setSelectedUploadRequest] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Add this function to handle opening the media viewer
  const openMediaViewer = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsMediaModalOpen(true);
  };

  // Fetch media requests from the API
  useEffect(() => {
    const fetchMediaRequests = async () => {
      try {
        setIsLoading(true);

        const response = await API.get("/media-requests/getAllMediaRequests");

        setMediaRequests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMediaRequests();
  }, []);

  // Handle request status change
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await API.patch(`/media-requests/${requestId}/status`, {
        status: newStatus,
      });

      setMediaRequests(
        mediaRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (err) {
      console.error(`Error updating request status to ${newStatus}:`, err);
    }
  };

  // Open view request details modal
  const openViewModal = (request) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const openUploadModal = (request) => {
    setSelectedUploadRequest(request);
    setIsUploadModalOpen(true);
    setUploadFiles([]);
    setUploadProgress(0);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Validate file count
    if (files.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files at once.`);
      return;
    }

    // Validate file sizes and types
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/mov",
        "video/avi",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported format.`);
        return false;
      }

      return true;
    });

    setUploadFiles(validFiles);
  };

  const handleUploadMedia = async () => {
    if (!uploadFiles.length || !selectedUploadRequest) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();

    uploadFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 10;
          return next > 90 ? 90 : next;
        });
      }, 300);

      await uploadMedia(selectedUploadRequest._id, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setMediaRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === selectedUploadRequest._id
            ? {
                ...request,
                status: "uploaded",
              }
            : request
        )
      );

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSelectedUploadRequest(null);
        setUploadFiles([]);
        setUploadProgress(0);
        toast.success("Media uploaded successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error uploading media:", error.message);
      toast.error("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const removeFile = (indexToRemove) => {
    setUploadFiles(uploadFiles.filter((_, index) => index !== indexToRemove));
  };

  // Filter requests based on search and filters
  const filteredRequests = mediaRequests.filter((request) => {
    const matchesSearch =
      (request.report?.customId?.toString() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (request.requestedBy?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.inquiryText || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || request.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle error state
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center mt-10 text-red-500">
          Failed to load media requests: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Requests Table */}
      <div className="bg-white overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Report ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vehicle
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Incident Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date Requested
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading media requests...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No media requests found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        <Film className="h-6 w-6 text-indigo-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.report?.customId || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.report?.vehicles?.[0]?.registration || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.report?.vehicles?.[0]?.make}{" "}
                      {request.report?.vehicles?.[0]?.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.report?.incidentType || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 capitalize inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View details button */}
                      <button
                        onClick={() => openViewModal(request)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded-full"
                        title="View request details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {request.status === "uploaded" &&
                        request.mediaUrls &&
                        request.mediaUrls.length > 0 && (
                          <button
                            onClick={() =>
                              openMediaViewer(request.mediaUrls[0])
                            }
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded-full"
                            title="View media"
                          >
                            <Camera className="w-5 h-5" />
                          </button>
                        )}

                      {/* Status toggle buttons */}
                      {request.status === "uploaded" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "approved")
                            }
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded-full"
                            title="Approve request"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "rejected")
                            }
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                            title="Reject request"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {request.status === "approved" && (
                        <button
                          onClick={() =>
                            handleStatusChange(request._id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                          title="Reject request"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}

                      {request.status === "approved" &&
                        request.mediaUrls?.length > 0 && (
                          <button
                            onClick={() =>
                              openMediaViewer(request.mediaUrls[0])
                            }
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded-full"
                            title="View media"
                          >
                            <Camera className="w-5 h-5" />
                          </button>
                        )}

                      {request.status === "rejected" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "approved")
                            }
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded-full"
                            title="Approve request"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openUploadModal(request)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded-full"
                        title="Upload media"
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Media Viewer Modal */}
      {isMediaModalOpen && selectedMedia && (
        <div className="fixed z-40 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setIsMediaModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Media Viewer
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  onClick={() => setIsMediaModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div
                className="bg-gray-900 flex justify-center items-center p-2"
                style={{ minHeight: "400px" }}
              >
                {selectedMedia.toLowerCase().endsWith(".mp4") ||
                selectedMedia.toLowerCase().endsWith(".mov") ||
                selectedMedia.toLowerCase().endsWith(".avi") ? (
                  <video controls className="max-h-[70vh] max-w-full" autoPlay>
                    <source src={selectedMedia} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={selectedMedia}
                    alt="Uploaded evidence"
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <a
                  href={selectedMedia}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Media
                </a>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsMediaModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setIsViewModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Media Request Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Report Information
                    </h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Report ID:</span>{" "}
                        {selectedRequest.report?.customId || "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Incident Type:</span>{" "}
                        {selectedRequest.report?.incidentType || "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Location:</span>{" "}
                        {selectedRequest.report?.location || "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Date:</span>{" "}
                        {selectedRequest.report?.date
                          ? new Date(
                              selectedRequest.report.date
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Vehicle Information
                    </h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Registration:</span>{" "}
                        {selectedRequest.report?.vehicles?.[0]?.registration ||
                          "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Make/Model:</span>{" "}
                        {`${
                          selectedRequest.report?.vehicles?.[0]?.make || ""
                        } ${
                          selectedRequest.report?.vehicles?.[0]?.model || ""
                        }`.trim() || "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Color:</span>{" "}
                        {selectedRequest.report?.vehicles?.[0]?.vehicleColour ||
                          "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          Identifying Features:
                        </span>{" "}
                        {selectedRequest.report?.vehicles?.[0]
                          ?.identifyingFeatures || "None"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Request Details
                    </h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedRequest.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : selectedRequest.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedRequest.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Request Date:</span>{" "}
                        {new Date(selectedRequest.createdAt).toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <span className="font-medium">Inquiry Text:</span>
                        <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                          {selectedRequest.inquiryText ||
                            "No additional information provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Report Description
                    </h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.report?.description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        handleStatusChange(selectedRequest._id, "approved");
                        setIsViewModalOpen(false);
                      }}
                    >
                      Approve Request
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        handleStatusChange(selectedRequest._id, "rejected");
                        setIsViewModalOpen(false);
                      }}
                    >
                      Reject Request
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && selectedUploadRequest && (
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
              <DialogDescription>
                Upload evidence media for Report ID:{" "}
                {selectedUploadRequest.report?.customId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {!isUploading ? (
                <div
                  onClick={() => document.getElementById("uploadFiles").click()}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Images (JPG, PNG, GIF, WEBP) or videos (MP4, MOV, AVI)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Up to {MAX_FILES} files, max 10MB each
                  </p>
                  <input
                    type="file"
                    id="uploadFiles"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept="image/jpeg,image/png,image/gif,video/mp4,video/mov,video/avi,image/webp"
                  />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Uploading files...
                    </p>
                    <Progress value={uploadProgress} className="h-2 w-full" />
                    <p className="text-xs text-gray-500 mt-2">
                      {Math.round(uploadProgress)}% complete
                    </p>
                  </div>
                </div>
              )}

              {/* Display selected files */}
              {uploadFiles.length > 0 && !isUploading && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </h4>
                  {uploadFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {file.type.startsWith("image/") ? (
                          <Camera className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Film className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm text-gray-700 truncate max-w-40">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFiles([]);
                  setSelectedUploadRequest(null);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadMedia}
                disabled={uploadFiles.length === 0 || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Media"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MediaAccessManagement;
