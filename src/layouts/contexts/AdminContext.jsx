import React, { createContext, useState, useContext } from "react";

// Crea el contexto
const AdminContext = createContext();

// Hook personalizado para usar el contexto
export const useAdmin = () => useContext(AdminContext);

// Proveedor del contexto
export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [reviewCountOrder, setReviewCountOrder] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [refreshOrdersCount, setRefreshOrdersCount] = useState(false);

  const showLoading = () => setLoading(true); // Función para mostrar el loader
  const hideLoading = () => setLoading(false); // Función para ocultar el loader

  return (
    <AdminContext.Provider
      value={{
        loading,
        showLoading,
        hideLoading,
        reviewCountOrder,
        setReviewCountOrder,
        reviewCount,
        setReviewCount,
        refreshOrdersCount,
        setRefreshOrdersCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
