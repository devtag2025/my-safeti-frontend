import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Clock, Eye } from "lucide-react";
import { getAllReports, updateReport } from "../../api/reportService";

const ReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const reportsData = await getAllReports();
        // console.log(reportsData);
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle report approval
  const handleApproveReport = async (reportId, userId) => {
    try {
      // Call API to update report status
      await updateReport(reportId, userId, {
        status: "approved",
      });

      // Update local state
      setReports(
        reports.map((report) =>
          report._id === reportId ? { ...report, status: "approved" } : report
        )
      );
    } catch (err) {
      console.error("Error approving report:", err);
    }
  };

  const handleRejectReport = async (reportId, userId) => {
    try {
      await updateReport(reportId, userId, {
        status: "rejected",
      });

      // Update local state
      setReports(
        reports.map((report) =>
          report._id === reportId ? { ...report, status: "rejected" } : report
        )
      );
    } catch (err) {
      console.error("Error rejecting report:", err);
    }
  };

  // Open modal to view report details
  const openViewModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get user info (if available)
  const getUserInfo = (userId) => {
    return userId || "Anonymous";
  };

  // Get media URLs or placeholders
  const getMediaUrls = (report) => {
    if (report.mediaUrls && report.mediaUrls.length > 0) {
      return report.mediaUrls;
    }

    if (report.mediaFlag) {
      return ["/api/placeholder/400/300"];
    }

    return [];
  };

  return (
    <div className="p-6">
      {/* Reports Queue */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Reports Queue</h3>
          <p className="text-sm text-gray-500">
            Pending reports awaiting moderation
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-10 w-10 mx-auto mb-4 animate-pulse" />
            <p>Loading reports...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <AlertCircle className="h-10 w-10 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : reports.filter((r) => r.status === "pending").length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500" />
            <p>No pending reports to review.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports
              .filter((report) => report.status === "pending")
              .map((report) => (
                <div key={report._id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {report.incidentType}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>
                          <span className="font-medium">ID:</span> {report._id}
                        </p>
                        <p>
                          <span className="font-medium">Vehicle:</span>{" "}
                          {report.vehicles[0].registration}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {report.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => openViewModal(report)}
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReport(report._id, report.userId)
                        }
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRejectReport(report._id, report.userId)
                        }
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recently Moderated Reports */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">
            Recently Moderated
          </h3>
          <p className="text-sm text-gray-500">
            Reports that have been reviewed
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-10 w-10 mx-auto mb-4 animate-pulse" />
            <p>Loading reports...</p>
          </div>
        ) : reports.filter((r) => r.status !== "pending").length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="h-10 w-10 mx-auto mb-4 text-blue-500" />
            <p>No reports have been moderated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
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
                    Vehicle
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
                    Moderated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports
                  .filter((report) => report.status !== "pending")
                  .map((report) => (
                    <tr key={report._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.incidentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.vehicles[0].registration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${
                          report.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        >
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(report.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button
                          onClick={() => openViewModal(report)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing details */}
      {isModalOpen && selectedReport && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Report Details
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Report ID</p>
                        <p className="font-medium">{selectedReport._id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted By</p>
                        <p className="font-medium">
                          {getUserInfo(selectedReport.userId)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Incident Type</p>
                        <p className="font-medium">
                          {selectedReport.incidentType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Vehicle Registration</p>
                        <p className="font-medium">
                          {selectedReport.vehicles[0].registration}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{selectedReport.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted At</p>
                        <p className="font-medium">
                          {formatDate(selectedReport.createdAt)}
                        </p>
                      </div>
                      {selectedReport.date && (
                        <div>
                          <p className="text-gray-500">Incident Date</p>
                          <p className="font-medium">
                            {formatDate(selectedReport.date)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium mt-1">
                        {selectedReport.description}
                      </p>
                    </div>

                    {selectedReport.mediaFlag && (
                      <div>
                        <p className="text-gray-500 mb-2">Media</p>
                        <div className="grid grid-cols-2 gap-2">
                          {getMediaUrls(selectedReport).map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Report media ${index + 1}`}
                              className="rounded-md w-full h-auto"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportModeration;
