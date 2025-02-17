import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ClientRoute = () => {
  const { user } = useAuthStore();
  return user?.role === "client" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default ClientRoute;
