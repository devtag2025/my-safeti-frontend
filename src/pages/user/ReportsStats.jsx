import { useEffect, useState } from "react";
import { getUserReportStats } from "../../api/reportService";

const ReportsStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getUserReportStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading report statistics...</p>;
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Report Statistics</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Reports" value={stats.totalReports} bgColor="bg-blue-500" />
                <StatCard title="Pending Reports" value={stats.pendingReports} bgColor="bg-yellow-500" />
                <StatCard title="Approved Reports" value={stats.approvedReports} bgColor="bg-green-500" />
            </div>

            {/* Latest Report */}
            {stats.latestReport && (
                <div className="mt-8 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest Report</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <p className="text-gray-700"><strong>Vehicle:</strong> {stats.latestReport.vehicleRegistration}</p>
                        <p className="text-gray-700"><strong>Incident:</strong> {stats.latestReport.incidentType}</p>
                        <p className="text-gray-700"><strong>Status:</strong>
                            <span className={`ml-2 px-2 py-1 text-sm font-semibold rounded-md
                ${stats.latestReport.status === "approved" ? "bg-green-200 text-green-800" :
                                    stats.latestReport.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                        "bg-red-200 text-red-800"
                                }`}>
                                {stats.latestReport.status}
                            </span>
                        </p>
                        <p className="text-gray-700"><strong>Location:</strong> {stats.latestReport.location}</p>
                        <p className="text-gray-700"><strong>Date:</strong> {new Date(stats.latestReport.date).toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, bgColor }) => (
    <div className={`p-6 ${bgColor} text-white rounded-lg shadow-md`}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default ReportsStats;
