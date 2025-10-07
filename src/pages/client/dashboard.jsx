import { useState, useEffect } from "react";
import { getAllReports } from "../../api/reportService";
import { fetchClientRequests } from "../../api/mediaRequestService";
import WelcomeBanner from "./WelcomeBanner";
import ReportsTable from "./ReportsTable";
import ReportSearch from "./ReportSearch";
import DataAnalytics from "./DataAnalytics";
import MediaAccessManagement from "./MediaAccessManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Camera,
  Loader2,
} from "lucide-react";

/**
 * Theme variables used across this component
 * - CRIMSON: primary accent (hero / buttons / active tabs)
 * - CRIMSON_LIGHT: lighter crimson used for gradients
 * - MUTED: used for subtle borders / backgrounds
 */
const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";
const MUTED = "rgba(110,0,1,0.06)";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, mediaRequestsData] = await Promise.all([
          getAllReports(),
          fetchClientRequests(),
        ]);
        const approvedReports = reportsData.filter(
          (report) => report.status === "approved"
        );
        setReports(approvedReports);
        setMediaRequests(mediaRequestsData);

        const requestedIds = new Set(mediaRequestsData.map((req) => req.report._id));
        setRequestedReports(requestedIds);

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

  const filteredReports = reports.filter((report) => {
    const matchesVehicle =
      !filters.vehicleRegistration ||
      report.vehicles?.some((vehicle) =>
        vehicle.registration
          ?.toLowerCase()
          .includes(filters.vehicleRegistration.toLowerCase())
      );

    const matchesDateRange =
      (!filters.startDate || new Date(report.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(report.date) <= new Date(filters.endDate));

    const matchesLocation =
      !filters.location ||
      report.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
      report.suburb?.toLowerCase().includes(filters.location.toLowerCase()) ||
      report.state?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesIncidentType = !filters.incidentType || report.incidentType === filters.incidentType;
    const matchesStatus = !filters.status || report.status === filters.status;
    const matchesMedia = !filters.hasMedia || report.hasDashcam === true;

    return matchesVehicle && matchesDateRange && matchesLocation && matchesIncidentType && matchesStatus && matchesMedia;
  });

  const handleMediaRequest = (reportId) => {
    setRequestedReports((prev) => new Set([...prev, reportId]));
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#fff,#f8f6f6)" }}>
      <div className="pt-10">
        <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
          {loading ? (
            <Card style={{ border: `1px solid ${MUTED}`, boxShadow: "0 6px 18px rgba(110,0,1,0.04)" }}>
              <CardContent className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: CRIMSON }} />
                  <span className="text-gray-700">Loading dashboard...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              {/* Top tab bar */}
              <Card className="shadow-sm" style={{ border: `1px solid ${MUTED}`, overflow: "hidden" }}>
                <CardContent className="p-4 w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center space-x-2 justify-center"
                      style={{
                        borderRadius: 8,
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4" style={{ color: activeTab === "overview" ? CRIMSON : undefined }} />
                      <span className="hidden sm:inline" style={{ color: activeTab === "overview" ? CRIMSON : undefined }}>
                        Overview
                      </span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="reports"
                      className="flex items-center space-x-2 justify-center"
                      style={{ borderRadius: 8 }}
                    >
                      <Search className="w-4 h-4" style={{ color: activeTab === "reports" ? CRIMSON : undefined }} />
                      <span className="hidden sm:inline" style={{ color: activeTab === "reports" ? CRIMSON : undefined }}>
                        Report Search
                      </span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="analytics"
                      className="flex items-center space-x-2 justify-center"
                      style={{ borderRadius: 8 }}
                    >
                      <BarChart3 className="w-4 h-4" style={{ color: activeTab === "analytics" ? CRIMSON : undefined }} />
                      <span className="hidden sm:inline" style={{ color: activeTab === "analytics" ? CRIMSON : undefined }}>
                        Analytics
                      </span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="media"
                      className="flex items-center space-x-2 justify-center"
                      style={{ borderRadius: 8 }}
                    >
                      <Camera className="w-4 h-4" style={{ color: activeTab === "media" ? CRIMSON : undefined }} />
                      <span className="hidden sm:inline" style={{ color: activeTab === "media" ? CRIMSON : undefined }}>
                        Media Access
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-4">
                <WelcomeBanner accentColor={CRIMSON} />
                <Card style={{ border: `1px solid ${MUTED}` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                      <Badge variant="outline" style={{ borderColor: MUTED, color: CRIMSON }}>
                        Showing latest 5 reports
                      </Badge>
                    </div>

                    <ReportsTable
                      reports={filteredReports.slice(0, 5)}
                      requestedReports={requestedReports}
                      onRequestMedia={handleMediaRequest}
                      compact={true}
                      accentColor={CRIMSON}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Report Search */}
              <TabsContent value="reports" className="space-y-4">
                <Card style={{ border: `1px solid ${MUTED}` }}>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Search & Filter Reports</h3>
                      <p className="text-sm text-gray-600">
                        Use the filters below to find specific incident reports
                      </p>
                    </div>

                    <ReportSearch onFilterChange={handleFilterChange} filters={filters} accentColor={CRIMSON} />
                  </CardContent>
                </Card>

                <Card style={{ border: `1px solid ${MUTED}` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                      <Badge variant="outline" style={{ borderColor: MUTED, color: CRIMSON }}>
                        {filteredReports.length} reports found
                      </Badge>
                    </div>

                    <ReportsTable
                      reports={filteredReports}
                      requestedReports={requestedReports}
                      onRequestMedia={handleMediaRequest}
                      accentColor={CRIMSON}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics" className="space-y-4">
                <Card style={{ border: `1px solid ${MUTED}` }}>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Data Analytics</h3>
                      <p className="text-sm text-gray-600">
                        Comprehensive insights and trends from your report data
                      </p>
                    </div>

                    <DataAnalytics reports={filteredReports} accentColor={CRIMSON} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Media Access */}
              <TabsContent value="media" className="space-y-4">
                <Card style={{ border: `1px solid ${MUTED}` }}>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Media Access Management</h3>
                      <p className="text-sm text-gray-600">Manage your media requests and access permissions</p>
                    </div>

                    <MediaAccessManagement
                      mediaRequests={mediaRequests}
                      reports={reports.filter((r) => r.hasDashcam)}
                      onRequestMedia={handleMediaRequest}
                      accentColor={CRIMSON}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
