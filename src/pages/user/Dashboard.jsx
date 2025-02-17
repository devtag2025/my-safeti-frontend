import React, { useState, useEffect } from "react";
import { getUserReports } from "../../api/reportService";
import ReportModal from "../../components/modals/reportModal";

const UserDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserReports();
        console.log(data);
        setReports(data);
      } catch (err) {
        setError(err.error || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
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
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {report.incidentType}
            </h2>
            <p className="text-gray-600">
              <span className="font-bold">Status:</span> {report.status}
            </p>
            <p className="text-gray-600 mt-1">
              <span className="font-bold">Date:</span>{" "}
              {new Date(report.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {/* Modal for report details */}
      <ReportModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default UserDashboard;
