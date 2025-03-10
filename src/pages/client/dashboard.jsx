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
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, mediaRequestsData] = await Promise.all([
          getAllReports(),
          fetchClientRequests(),
        ]);

        setReports(reportsData);
        setMediaRequests(mediaRequestsData);

        // Extract report IDs from media requests and store them in a set
        const requestedIds = new Set(
          mediaRequestsData.map((req) => req.report._id)
        );
        setRequestedReports(requestedIds);

        // Mock client stats (would come from API in production)
        setClientStats({
          totalReportsAccessed: mediaRequestsData.length,
          creditBalance: 500, // Example value
          activeSearches: 3, // Example value
          highRiskDrivers: reportsData.filter(
            (r) =>
              r.status === "approved" &&
              (r.incidentType === "Reckless Driving" ||
                r.incidentType === "Speeding")
          ).length,
        });

        // Mock recent activity (would come from API in production)
        setRecentActivity(
          mediaRequestsData.slice(0, 5).map((req) => ({
            id: req._id,
            action: "Media requested",
            reportId: req.report._id,
            vehicle: req.report.vehicleRegistration,
            timestamp: new Date(req.createdAt || Date.now()).toISOString(),
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Apply filters to reports
  const filteredReports = reports.filter((report) => {
    const matchesVehicle =
      !filters.vehicleRegistration ||
      report.vehicleRegistration
        .toLowerCase()
        .includes(filters.vehicleRegistration.toLowerCase());

    const matchesDateRange =
      (!filters.startDate ||
        new Date(report.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(report.date) <= new Date(filters.endDate));

    const matchesLocation =
      !filters.location ||
      report.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesIncidentType =
      !filters.incidentType || report.incidentType === filters.incidentType;

    const matchesStatus = !filters.status || report.status === filters.status;

    const matchesMedia = !filters.hasMedia || report.mediaFlag === true;

    return (
      matchesVehicle &&
      matchesDateRange &&
      matchesLocation &&
      matchesIncidentType &&
      matchesStatus &&
      matchesMedia
    );
  });

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

      {/* Dashboard content based on active tab */}
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
                <div className="">
                  <ReportsTable
                    reports={filteredReports.slice(0, 5)}
                    requestedReports={requestedReports}
                    compact={true}
                  />
                </div>
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
                />
              </div>
            )}

            {activeTab === "analytics" && <DataAnalytics reports={reports} />}

            {activeTab === "media" && (
              <MediaAccessManagement
                mediaRequests={mediaRequests}
                reports={reports.filter((r) => r.mediaFlag)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
