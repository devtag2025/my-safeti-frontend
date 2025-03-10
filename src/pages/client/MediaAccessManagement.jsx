import { useState, useEffect } from "react";
import {
  requestMedia,
  fetchClientRequests,
} from "../../api/mediaRequestService";

const MediaAccessManagement = ({
  mediaRequests: initialMediaRequests = [],
  reports: initialReports = [],
}) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingRequest, setProcessingRequest] = useState(null);
  const [reports, setReports] = useState(initialReports);
  const [mediaRequests, setMediaRequests] = useState(initialMediaRequests);

  // Get all reports with media
  const reportsWithMedia = reports.filter((report) => report.mediaFlag);

  // Get IDs of reports that already have media requests
  const requestedReportIds = new Set(
    mediaRequests.map((req) => req.report._id)
  );

  // Filter reports based on current filter and search term
  const filteredReports = (() => {
    let filtered = [];

    switch (filter) {
      case "all":
        filtered = reportsWithMedia;
        break;
      case "available":
        filtered = reportsWithMedia.filter(
          (report) => !requestedReportIds.has(report._id)
        );
        break;
      case "requested":
        filtered = reportsWithMedia.filter((report) =>
          requestedReportIds.has(report._id)
        );
        break;
      case "downloaded":
        // For this demo, we'll assume none have been downloaded yet
        filtered = [];
        break;
      default:
        filtered = reportsWithMedia;
    }

    // Apply search filter if present
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.vehicleRegistration.toLowerCase().includes(term) ||
          report.location.toLowerCase().includes(term) ||
          report._id.toLowerCase().includes(term)
      );
    }

    return filtered;
  })();

  // Update props to state when they change
  useEffect(() => {
    setReports(initialReports);
    setMediaRequests(initialMediaRequests);
  }, [initialReports, initialMediaRequests]);

  // Handle media request
  const handleRequestMedia = async (reportId) => {
    try {
      setProcessingRequest(reportId);

      // Send the request to the API
      const response = await requestMedia(reportId);

      // Fetch updated media requests
      const updatedRequests = await fetchClientRequests();

      // In a real app, the above would return the new request data
      // For now, we'll simulate the response by creating a new request object
      const report = reports.find((r) => r._id === reportId);
      const newRequest = {
        _id: `temp-${Date.now()}`, // Temporary ID until page refresh
        report: report,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      // Update the local state with the new request
      setMediaRequests((prevRequests) => [...prevRequests, newRequest]);

      alert("Media request submitted successfully. Cost: $139 AUD");
      setProcessingRequest(null);
    } catch (error) {
      console.error("Error requesting media:", error);
      alert("Failed to request media. Please try again.");
      setProcessingRequest(null);
    }
  };

  // Find request details for a report
  const getRequestDetails = (reportId) => {
    return mediaRequests.find((req) => req.report._id === reportId);
  };

  return (
    <div className="space-y-6">
      {/* Header and controls */}
      <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-700">
              Media Access Management
            </h2>
            <p className="text-gray-500 mt-1">
              Request and manage access to user-submitted incident media
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by registration or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setFilter("all")}
              className={`py-4 px-1 ${
                filter === "all"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setFilter("requested")}
              className={`py-4 px-1 ${
                filter === "requested"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Requested
            </button>
          </div>
        </div>
      </div>

      {/* Media report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
          <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Media Found
            </h3>
            <p className="mt-1 text-gray-500">
              {filter === "available"
                ? "No available media reports match your search criteria."
                : filter === "requested"
                ? "You haven't requested any media yet."
                : filter === "downloaded"
                ? "You haven't downloaded any media yet."
                : "No media reports match your search criteria."}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const requestDetails = getRequestDetails(report._id);
            const isRequested = !!requestDetails;
            const isDownloaded = false; // For demo purposes

            return (
              <div
                key={report._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Header with vehicle info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.vehicleRegistration}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.incidentType === "Speeding"
                            ? "bg-red-100 text-red-800"
                            : report.incidentType === "Running Red Light"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.incidentType === "Reckless Driving"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {report.incidentType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-gray-500">Location</span>
                      <span className="block font-medium text-gray-900 mt-1 capitalize">
                        {report.location}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Status</span>
                      <span
                        className={`block font-medium mt-1 ${
                          report.status === "approved"
                            ? "text-green-600"
                            : report.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="block text-gray-500">Media Type</span>
                      <span className="block font-medium text-gray-900 mt-1">
                        {/* In a real app, this would show the actual media type */}
                        Photo / Video
                      </span>
                    </div>
                  </div>

                  {/* Request status */}
                  {isRequested && (
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Media request submitted on{" "}
                            {new Date(
                              requestDetails.createdAt || Date.now()
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  {!isRequested && !isDownloaded ? (
                    <button
                      onClick={() => handleRequestMedia(report._id)}
                      disabled={processingRequest === report._id}
                      className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        processingRequest === report._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {processingRequest === report._id ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Request Media - $139 AUD</>
                      )}
                    </button>
                  ) : isRequested && !isDownloaded ? (
                    <div className="text-center text-sm text-gray-600">
                      Awaiting media approval
                    </div>
                  ) : (
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Download Media
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction history */}
      {mediaRequests.length > 0 && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Transaction History
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
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
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mediaRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(
                        request.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.report._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.report.vehicleRegistration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      $139.00 AUD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.report.status === "approved"
                            ? "text-green-600"
                            : request.report.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {request.report.status.charAt(0).toUpperCase() +
                          request.report.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAccessManagement;
