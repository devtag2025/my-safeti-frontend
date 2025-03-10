import { useState, useEffect } from "react";

const WelcomeBanner = () => {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    subscriptionStatus: "",
    subscriptionExpiry: "",
  });

  const [stats, setStats] = useState({
    totalReportsAccessed: 0,
    creditBalance: 0,
  });

  useEffect(() => {
    // In a real application, this would fetch from an API
    // Mocking data for demonstration
    setClientInfo({
      name: "SafeInsure Co.",
      subscriptionStatus: "Premium",
      subscriptionExpiry: "2025-12-31",
    });

    setStats({
      totalReportsAccessed: 48,
      creditBalance: 500,
    });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "premium":
        return "bg-green-100 text-green-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "trial":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
      {/* Left Side - Welcome Message */}
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {clientInfo.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Access real-time driver risk data and analytics
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="p-2 rounded-full bg-blue-100 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-gray-500 text-xs font-medium">Reports Accessed</p>
          <p className="text-lg font-semibold text-gray-800">
            {stats.totalReportsAccessed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
