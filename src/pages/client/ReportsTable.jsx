import { useState, useEffect } from "react";
import { requestMedia } from "../../api/mediaRequestService";
import PDFExport from "./PdfExport";
// import PDFExport from "../shared/PDFExport";

const ReportsTable = ({
  reports,
  requestedReports,
  onRequestMedia,
  compact = false,
}) => {
  console.log(reports)
  const [currentRequestId, setCurrentRequestId] = useState(null);
  // Create a local copy of requested reports combining props with local state
  const [localRequestedReports, setLocalRequestedReports] = useState(new Set());

  // Update local state when the prop changes
  useEffect(() => {
    setLocalRequestedReports(new Set(requestedReports));
  }, [requestedReports]);

  const handleRequestMedia = async (reportId) => {
    try {
      setCurrentRequestId(reportId);
      await requestMedia(reportId);

      // Update local state to reflect the change immediately
      setLocalRequestedReports((prev) => new Set([...prev, reportId]));

      // Also notify parent component if callback exists
      if (onRequestMedia) {
        onRequestMedia(reportId);
      }

      setCurrentRequestId(null);
    } catch (error) {
      console.error("Error requesting media:", error.message);
      alert("Failed to request media. Please try again.");
      setCurrentRequestId(null);
    }
  };

  const getRiskScore = (report) => {
    // Simple algorithm to calculate risk score based on incident type
    const incidentWeights = {
      Speeding: 8,
      "Running Red Light": 9,
      "Reckless Driving": 10,
      Tailgating: 7,
      Other: 5,
    };

    const baseScore = incidentWeights[report.incidentType] || 5;
    const mediaBonus = report.hasDashcam ? 2 : 0;

    return Math.min(10, baseScore + mediaBonus);
  };

  const getRiskColor = (score) => {
    if (score >= 9) return "text-red-700 bg-red-100";
    if (score >= 7) return "text-orange-700 bg-orange-100";
    if (score >= 5) return "text-yellow-700 bg-yellow-100";
    return "text-green-700 bg-green-100";
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">
          {compact ? "Recent Reports" : "Driver Incident Reports"}
        </h3>
        {compact && (
          <p className="text-sm text-gray-500 mt-1">
            Showing the 5 most recent reports. View all in Report Search.
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Vehicle
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Incident Type
              </th>
              {!compact && (
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                Media
              </th>
              {!compact && (
                <th scope="col" className="px-6 py-3">
                  Risk Score
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={compact ? "7" : "8"}
                  className="p-6 text-center text-gray-500"
                >
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const riskScore = getRiskScore(report);
                const riskColorClass = getRiskColor(riskScore);
                const isRequested = localRequestedReports.has(report._id);

                return (
                  <tr
                    key={report._id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {report.vehicles[0].registration}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{report.location}</td>
                    <td className="px-6 py-4">{report.incidentType}</td>

                    {!compact && (
                      <td
                        className={`px-6 py-4 ${report.status === "approved"
                            ? "text-green-700"
                            : report.status === "rejected"
                              ? "text-red-700"
                              : "text-yellow-700"
                          }`}
                      >
                        {report.status}
                      </td>
                    )}

                    <td className="px-6 py-4">
                      {report.hasDashcam ? (
                        <span className="text-gray-500">Available</span>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td>

                    {!compact && (
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${riskColorClass}`}
                        >
                          {riskScore.toFixed(1)} / 10
                        </span>
                      </td>
                    )}

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        {report.hasDashcam && !isRequested && (
                          <button
                            onClick={() => handleRequestMedia(report._id)}
                            disabled={currentRequestId === report._id}
                            className={`px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition ${currentRequestId === report._id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                              }`}
                          >
                            {currentRequestId === report._id
                              ? "Requesting..."
                              : "Request Media"}
                          </button>
                        )}

                        {report.hasDashcam && isRequested && (
                          <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                            Requested
                          </span>
                        )}

                        <button
                          onClick={() => PDFExport.downloadReportAsPDF(report)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!compact && reports.length > 0 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {reports.length} reports
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
