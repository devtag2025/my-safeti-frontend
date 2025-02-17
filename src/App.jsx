import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/user/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Report from "./pages/user/Report";
import UserDashboard from "./pages/user/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ClientRoute from "./routes/clientRoute";
import AdminRoute from "./routes/adminRoute";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div className="pt-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<Home />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report" element={<Report />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Route>

          {/* Client Routes */}
          <Route element={<ClientRoute />}>
            {/* <Route path="/client" element={<ClientDashboard />} /> */}
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
