import React, { useState, useEffect } from "react";
import { getUserReports, deleteReport } from "../../api/reportService";
import ReportModal from "../../components/modals/reportModal";
import EditReportForm from "../../components/forms/EditReportForm";


const UserDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserReports();
      setReports(data);
    } catch (err) {
      setError(err.error || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(reportId);
        alert("Report deleted successfully!");
        fetchReports(); // Refresh reports list
        setIsModalOpen(false);
      } catch (error) {
        alert("Error deleting report: " + error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-500";
      case "approved":
        return "bg-green-100 text-green-700 border-green-500";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-500";
      default:
        return "bg-gray-100 text-gray-700 border-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Dashboard</h1>
      {loading && <p className="text-gray-600">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && reports.length === 0 && (
        <p className="text-gray-600">No reports found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report._id}
            onClick={() => openModal(report)}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl transition mt-4"
          >
            <h2 className="text-xl font-semibold mb-2">
              {report.incidentType}
            </h2>
            <p
              className={`border rounded-md px-2 py-1 inline-block font-semibold ${getStatusColor(
                report.status
              )}`}
            >
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </p>
            <p className="text-gray-600 mt-1">
              <span className="font-bold">Date:</span>{" "}
              {new Date(report.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Report Details Modal */}
      <ReportModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={closeModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Report Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 transform transition-all">
            <EditReportForm
              reportToEdit={selectedReport}
              onSuccess={() => {
                setIsEditModalOpen(false);
                fetchReports(); // Refresh after update
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
