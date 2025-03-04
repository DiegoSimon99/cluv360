import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const CustomerRoutes = () => {
    const token = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");

    // Verificar si el usuario tiene token y es customer o seller
    if (!token || (userType !== "customer" && userType !== "seller")) {
        return <Navigate to="/login" replace />;
    }

    // Renderizar rutas anidadas si pasa la validación
    return <Outlet />;
};

export default CustomerRoutes;