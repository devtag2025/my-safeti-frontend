import { useState, useEffect } from "react";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

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
    // Mock/placeholder data (real app should fetch)
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

  const getStatusColorClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "premium") return "bg-green-100 text-green-800";
    if (s === "standard") return "bg-blue-100 text-blue-800";
    if (s === "basic") return "bg-gray-100 text-gray-800";
    if (s === "trial") return "bg-yellow-100 text-yellow-800";
    if (s === "expired") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
      style={{ background: "#ffffff", border: `1px solid ${CRIMSON}10` }}
    >
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {clientInfo.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Access real-time driver risk data and analytics
        </p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
        <div className="text-right">
          <div className="text-sm text-gray-500">Subscription</div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${getStatusColorClass(clientInfo.subscriptionStatus)}`}>
            {clientInfo.subscriptionStatus}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Expires {formatDate(clientInfo.subscriptionExpiry)}
          </div>
        </div>

        <div className="pl-6 border-l border-gray-100">
          <div className="text-sm text-gray-500">Reports accessed</div>
          <div className="text-lg font-semibold text-gray-900">{stats.totalReportsAccessed}</div>
          <div className="text-sm text-gray-500 mt-2">Credits: <span className="font-medium text-gray-900">{stats.creditBalance}</span></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
