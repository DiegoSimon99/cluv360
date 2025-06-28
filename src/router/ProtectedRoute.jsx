import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredPermissions = [] }) => {
  const userData = JSON.parse(localStorage.getItem("user_data"));

  if (!userData) {
    return <Navigate to="/auth/login" />;
  }

  const isAdmin = userData.user_type === "admin";

  const hasPermission =
    isAdmin ||
    requiredPermissions.some(permission =>
      userData.permissions
        .map(p => p.toString())
        .includes(permission.toString())
    );

  return hasPermission ? <Outlet /> : <Navigate to="/admin/dashboard" />;
};

export default ProtectedRoute;