import React, { createContext, useState, useContext } from "react";

// Crea el contexto
const LoadingContext = createContext();

// Hook personalizado para usar el contexto
export const useLoading = () => useContext(LoadingContext);

// Proveedor del contexto
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);   // Función para mostrar el loader
  const hideLoading = () => setLoading(false);  // Función para ocultar el loader

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
