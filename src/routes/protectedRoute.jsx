import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "guest";

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
