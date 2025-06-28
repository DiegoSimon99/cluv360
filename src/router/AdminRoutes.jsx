import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  // Verificar si el usuario tiene token y es admin o staff
  if (!token || (userType !== "admin" && userType !== "staff")) {
    return <Navigate to="/auth/login" replace />;
  }

  // Renderizar rutas anidadas si pasa la validación
  return <Outlet />;
};

export default AdminRoutes;
