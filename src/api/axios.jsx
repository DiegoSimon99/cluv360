import axios from "axios";

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Cambia según la URL de tu backend
});

// Interceptor de solicitud para agregar el token en los encabezados
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // Obtén el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Detectar si estamos enviando FormData
  if (config.data instanceof FormData) {
    // Deja que el navegador configure automáticamente el Content-Type para multipart/form-data
    delete config.headers["Content-Type"];
  } else {
    // Establecer Content-Type como JSON para otras solicitudes
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuesta para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Si el token expira, obtenemos los datos del usuario
      const userType = localStorage.getItem("user_type"); // Almacenar el tipo de usuario al iniciar sesión
      localStorage.removeItem("access_token"); // Limpiar el token

      // Redireccionar según el tipo de usuario
      if (userType === "admin" || userType === "staff") {
        window.location.href = "/auth/login"; // Redirigir al login de admin
      } else {
        window.location.href = "/"; // Redirigir a la página principal
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;