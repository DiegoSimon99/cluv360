import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiClient from "../api/axios";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Llamada opcional al backend para invalidar el token
      await apiClient.post("/logout", {});
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      // Limpiar el localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_data");
      // Redirigir al login
      navigate("/");
    }
  };

  return logout;
};

export default useLogout;
