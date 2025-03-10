import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "guest";


  const roleBasedRoutes = {
    user: "/home",
    client: "/client-dashboard",
    admin: "/admin-dashboard",
  };

  return user ? (
    <Navigate to={roleBasedRoutes[role] || "/login"} />
  ) : (
    <Navigate to="/login" />
  );
};

export default RoleRedirect;
