import { useLocation } from "react-router-dom";
import Layout from "./layouts/admin/Layout";
import AppRoutes from "./router/AppRoutes";
import { Blank } from "./layouts/admin/Blank";
import WebLayout from "./layouts/web/WebLayout";
import React, { useEffect } from "react";
import fetchUserData from "./hooks/fetchUserData";
import { AdminProvider } from "./layouts/contexts/AdminContext";

function App() {
  const location = useLocation();
  const isAuthPath =
    location.pathname.includes("auth") ||
    location.pathname.includes("error") ||
    location.pathname.includes("under-maintenance") ||
    location.pathname.includes("blank");

  const isAdminPath = location.pathname.includes("admin"); // Rutas del administrador
  const isWebPath = !isAdminPath && !isAuthPath; // Rutas de la versión web (si no es admin ni auth)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetchUserData();
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isAuthPath ? (
        <AppRoutes>
          <Blank />
        </AppRoutes>
      ) : isAdminPath ? (
        <AdminProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AdminProvider>
      ) : isWebPath ? (
        <WebLayout>
          <AppRoutes />
        </WebLayout>
      ) : null}
    </>
  );
}

export default App;
