import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { confirmAlert } from "react-confirm-alert";
import { showNotification } from "../utils/greetingHandler";
import { useAdmin } from "../layouts/contexts/AdminContext";

const useLogout = () => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useAdmin();

  const logout = async () => {
    confirmAlert({
      title: "Confirmar cierre de sesión",
      message: "¿Estás seguro de que deseas cerrar tu sesión?",
      buttons: [
        {
          label: "Sí, cerrar sesión",
          onClick: async () => {
            try {
              showLoading();
              await apiClient.post("/logout", {});
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al cerrar sesión", "error");
            } finally {
              hideLoading();
              // Limpiar el localStorage
              localStorage.removeItem("access_token");
              localStorage.removeItem("user_type");
              localStorage.removeItem("user_data");
              localStorage.removeItem("cart");
              // Redirigir al login
              navigate("/");
            }
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  return logout;
};

export default useLogout;
