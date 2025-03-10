import { useState } from "react";
import {
  BarChart,
  PieChart,
  UsersRound,
  FileText,
  Activity,
  DollarSign,
  Users,
  Bell,
  Layout,
  Menu,
  LogOut,
  X,
} from "lucide-react";

// Import submodules
import ClientRequests from "./ClientRequests";
import Advertisement from "./advertisment";
import AdminMediaReview from "./mediaReview";
import OverviewDashboard from "./OverviewDashboard";
import UserManagement from "./UserManagement";
import ReportModeration from "./ReportModeration";
import UserLogo from "../../assets/user.png";
import useAuthStore from "../../store/authStore";
import UserIcon from "../../assets/svgs/UserIcon";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [userName, setUserName] = useState("");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);


  // Sidebar menu items
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: "users",
      label: "User Management",
      icon: <UsersRound className="w-5 h-5" />,
    },
    {
      id: "reports",
      label: "Report Moderation",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "ads",
      label: "Advertisement",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      id: "revenue",
      label: "Revenue Analytics",
      icon: <DollarSign className="w-5 h-5" />,
    },
  ];

  // Render the active component based on selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <ReportModeration />;
      case "ads":
        return <Advertisement />;
      case "revenue":
        return <RevenueDashboard />;
      default:
        return <OverviewDashboard />;
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Responsive Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-gray-800 transition duration-300 transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:inset-0
        `}
      >
        <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
          <span className="text-white font-bold text-lg">Admin Dashboard</span>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors w-full ${
                  activeTab === item.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="p-1 mr-3 text-gray-500 rounded-full hover:bg-gray-100 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center">
              {/* <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 mr-3">
                <Bell className="w-6 h-6" />
              </button> */}
              {/* <div className="relative">
                <img
                  className="h-8 w-8 rounded-full"
                  src={UserLogo} 
                  alt="Admin profile"
                />
              </div> */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2"
                >
                  <UserIcon
                    size={24}
                    className="text-gray-700 cursor-pointer"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden">
                    <h1 className="ml-4 font-medium capitalize">
                      Hi, {userName || "User"}
                    </h1>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto bg-gray-100"
          onClick={handleContentClick}
        >
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

// Revenue Dashboard Component
const RevenueDashboard = () => {
  const revenueData = {
    totalEarnings: 24598.5,
    adRevenue: 12450.75,
    mediaRequests: 8723.25,
    otherRevenue: 3424.5,
    monthlyComparison: [
      { month: "Jan", amount: 15420 },
      { month: "Feb", amount: 18250 },
      { month: "Mar", amount: 17840 },
      { month: "Apr", amount: 19220 },
      { month: "May", amount: 21450 },
      { month: "Jun", amount: 24598 },
    ],
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-xl font-semibold">
                ${revenueData.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <BarChart className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Ad Revenue</p>
              <p className="text-xl font-semibold">
                ${revenueData.adRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Media Requests</p>
              <p className="text-xl font-semibold">
                ${revenueData.mediaRequests.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <Layout className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Other Revenue</p>
              <p className="text-xl font-semibold">
                ${revenueData.otherRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-64 flex items-end space-x-2">
            {revenueData.monthlyComparison.map((item) => (
              <div
                key={item.month}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className="bg-blue-500 w-full rounded-t"
                  style={{ height: `${(item.amount / 25000) * 100}%` }}
                ></div>
                <p className="text-xs font-medium mt-2">{item.month}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Revenue Distribution</h2>
          <div className="flex justify-center mb-4">
            <div className="w-48 h-48 rounded-full border-8 border-blue-500 relative">
              <div className="w-full h-full rounded-full border-8 border-l-green-500 border-t-green-500 border-r-transparent border-b-transparent transform -rotate-45"></div>
              <div className="w-full h-full absolute top-0 rounded-full border-8 border-l-transparent border-t-transparent border-r-purple-500 border-b-purple-500 transform -rotate-[165deg]"></div>
            </div>
          </div>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <p className="text-sm">Ads</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <p className="text-sm">Media</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <p className="text-sm">Other</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
