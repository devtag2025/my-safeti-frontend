import { useState, useEffect } from "react";
import { getAllReports } from "../../api/reportService";
import { fetchClientRequests } from "../../api/mediaRequestService";
import WelcomeBanner from "./WelcomeBanner";
import ReportsTable from "./ReportsTable";
import ReportSearch from "./ReportSearch";
import DataAnalytics from "./DataAnalytics";
import MediaAccessManagement from "./MediaAccessManagement";

const ClientDashboard = () => {
  const [reports, setReports] = useState([]);
  const [mediaRequests, setMediaRequests] = useState([]);
  const [filters, setFilters] = useState({
    vehicleRegistration: "",
    startDate: "",
    endDate: "",
    location: "",
    incidentType: "",
    status: "",
    hasMedia: false,
  });
  const [requestedReports, setRequestedReports] = useState(new Set());
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [clientStats, setClientStats] = useState({
    totalReportsAccessed: 0,
    creditBalance: 0,
    activeSearches: 0,
    highRiskDrivers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, mediaRequestsData] = await Promise.all([
          getAllReports(),
          fetchClientRequests(),
        ]);

        // Filter approved reports only
        const approvedReports = reportsData.filter(report => report.status === "approved");
        setReports(approvedReports);
        setMediaRequests(mediaRequestsData);

        // Extract report IDs from media requests
        const requestedIds = new Set(
          mediaRequestsData.map((req) => req.report._id)
        );
        setRequestedReports(requestedIds);

        // Calculate client stats
        setClientStats({
          totalReportsAccessed: mediaRequestsData.length,
          creditBalance: 500,
          activeSearches: 3,
          highRiskDrivers: approvedReports.filter(
            (r) =>
              r.incidentType === "Dangerous/Reckless Driving" ||
              r.incidentType === "Excessive Speed"
          ).length,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Fixed filtering with correct field names
  const filteredReports = reports.filter((report) => {
    // Vehicle registration filter - check vehicles array
    const matchesVehicle =
      !filters.vehicleRegistration ||
      report.vehicles?.some(vehicle => 
        vehicle.registration?.toLowerCase().includes(filters.vehicleRegistration.toLowerCase())
      );

    // Date range filter
    const matchesDateRange =
      (!filters.startDate ||
        new Date(report.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || 
        new Date(report.date) <= new Date(filters.endDate));

    // Location filter - check multiple location fields
    const matchesLocation =
      !filters.location ||
      report.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
      report.suburb?.toLowerCase().includes(filters.location.toLowerCase()) ||
      report.state?.toLowerCase().includes(filters.location.toLowerCase());

    // Incident type filter
    const matchesIncidentType =
      !filters.incidentType || 
      report.incidentType === filters.incidentType;

    // Status filter
    const matchesStatus = 
      !filters.status || 
      report.status === filters.status;

    // Media filter - check hasDashcam field
    const matchesMedia = 
      !filters.hasMedia || 
      report.hasDashcam === true;

    return (
      matchesVehicle &&
      matchesDateRange &&
      matchesLocation &&
      matchesIncidentType &&
      matchesStatus &&
      matchesMedia
    );
  });

  const handleMediaRequest = (reportId) => {
    setRequestedReports(prev => new Set([...prev, reportId]));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation tabs */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6">
          <div className="flex space-x-6">
            <button
              className={`py-4 px-2 cursor-pointer ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 px-2 cursor-pointer ${
                activeTab === "reports"
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Report Search & Analysis
            </button>
            <button
              className={`py-4 px-2 cursor-pointer ${
                activeTab === "analytics"
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Data Analytics
            </button>
            <button
              className={`py-4 px-2 cursor-pointer ${
                activeTab === "media"
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("media")}
            >
              Media Access
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex-1 container mx-auto px-6 py-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                <WelcomeBanner />
                <ReportsTable
                  reports={filteredReports.slice(0, 5)}
                  requestedReports={requestedReports}
                  onRequestMedia={handleMediaRequest}
                  compact={true}
                />
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <ReportSearch
                  onFilterChange={handleFilterChange}
                  filters={filters}
                />
                <ReportsTable
                  reports={filteredReports}
                  requestedReports={requestedReports}
                  onRequestMedia={handleMediaRequest}
                />
              </div>
            )}

            {activeTab === "analytics" && (
              <DataAnalytics reports={filteredReports} />
            )}

            {activeTab === "media" && (
              <MediaAccessManagement
                mediaRequests={mediaRequests}
                reports={reports.filter((r) => r.hasDashcam)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;