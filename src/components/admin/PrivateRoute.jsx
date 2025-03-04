import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("access_token");
  const user_data = localStorage.getItem("user_data");
  const location = useLocation();

  // Si no hay token, redirigir a "/"
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si el rol del usuario no está permitido para la ruta, redirigir a su dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user_data.user_type)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children; // Renderizar el contenido protegido
};

export default PrivateRoute;
