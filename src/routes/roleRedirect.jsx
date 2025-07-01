import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "guest";


  const roleBasedRoutes = {
    user: "/user",
    client: "/client",
    admin: "/admin",
  };

  return user ? (
    <Navigate to={roleBasedRoutes[role] || "/login"} />
  ) : (
    <Navigate to="/home" />
  );
};

export default RoleRedirect;
