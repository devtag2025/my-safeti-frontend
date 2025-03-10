import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./Scrollbar.css";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/user/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Report from "./pages/user/Report";
import UserDashboard from "./pages/user/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ClientDashboard from "./pages/client/dashboard";
import NotFound from "./pages/NotFound";
import RoleRedirect from "./routes/roleRedirect";
import MediaRequests from "./pages/user/MediaRequests";
import AdminMediaReview from "./pages/admin/mediaReview";
import Advertisement from "./pages/admin/advertisment";
import Homepage from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];

  // ✅ Hide the Navbar for all routes under /admin
  const isAdminRoute = location.pathname.startsWith("/admin");
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname) && !isAdminRoute;

  // ✅ Apply padding to all routes except /home and admin routes
  const shouldApplyPadding = location.pathname !== "/home" && !isAdminRoute;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div className={shouldApplyPadding ? "pt-16" : ""}>
        <Routes>
          {/* Role-Based Redirect */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Homepage />} />

          {/* 🔒User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user" element={<Home />} />
            <Route path="/media-requests" element={<MediaRequests />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report" element={<Report />} />
          </Route>

          {/* Client Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route path="/client" element={<ClientDashboard />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/media-review" element={<AdminMediaReview />} />
            <Route path="/ads" element={<Advertisement />} />
          </Route>

          {/* Catch-All 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
