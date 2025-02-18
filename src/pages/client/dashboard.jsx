import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllReports } from "../../api/reportService";
// import Sidebar from "../../components/Sidebar";

const ClientDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ incidentType: "", status: "" });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await getAllReports();
        setReports(reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // ✅ Filter Reports
  const filteredReports = reports.filter(
    (report) =>
      (!filters.incidentType || report.incidentType === filters.incidentType) &&
      (!filters.status || report.status === filters.status)
  );

  // ✅ Data for Charts
  const incidentStats = reports.reduce((acc, report) => {
    acc[report.incidentType] = (acc[report.incidentType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(incidentStats).map((key) => ({
    type: key,
    count: incidentStats[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      {/* <Sidebar /> */}

      {/* ✅ Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* 🔍 Filters */}
        <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">Client Dashboard</h2>
          <div className="flex space-x-3">
            <select
              className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
              onChange={(e) =>
                setFilters({ ...filters, incidentType: e.target.value })
              }
            >
              <option value="">All Incident Types</option>
              <option value="Speeding">Speeding</option>
              <option value="Running Red Light">Running Red Light</option>
              <option value="Reckless Driving">Reckless Driving</option>
              <option value="Tailgating">Tailgating</option>
              <option value="Other">Other</option>
            </select>

            <select
              className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {/* Table Header */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Media
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {report.vehicleRegistration}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{report.location}</td>
                    <td className="px-6 py-4">{report.incidentType}</td>
                    <td
                      className={`px-6 py-4 ${
                        report.status === "approved"
                          ? " text-green-700"
                          : report.status === "rejected"
                          ? " text-red-700"
                          : " text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </td>
                    {/* ✅ Media Column */}
                    <td className="px-6 py-4">
                      {report.mediaFlag ? (
                        <span className="text-gray-500"> Media Available</span>
                      ) : (
                        <span className="text-gray-500">No Media</span>
                      )}
                    </td>
                    {/* ✅ Actions */}
                    <td className="px-6 py-4 text-right">
                      {report.mediaFlag && (
                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                          Request Media
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📊 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Incidents Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Incident Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#4F46E5"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
