import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./page-auth.css";
import { AuthWrapper } from "./AuthWrapper";
import axios from "axios";
import { showNotification } from "../../../utils/greetingHandler";
import fetchUserData from "../../../hooks/fetchUserData";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");

    // Si hay token, redirigir según el tipo de usuario
    if (token) {
      if (userType === "admin" || userType === "staff") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    password: "",
    email: "",
    type: "CLUV360",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Paso 1: Login para obtener el token
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Guardar el token en localStorage
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);

      // Paso 2: Obtener los datos del usuario usando fetchUserData
      const user = await fetchUserData(); // Pasa el token directamente
      if (!user) {
        showNotification("No se pudieron obtener los datos del usuario.", "error");
      }

      localStorage.setItem("user_type", response.data.user_type); // Este valor lo envías desde el backend
      // Paso 3: Mostrar notificación de éxito
      localStorage.setItem(
        "notification",
        JSON.stringify({
          type: "success",
          message: "Inicio de sesión exitoso",
        })
      );

      // Paso 4: Redirigir según el rol o al dashboard por defecto
      navigate("/admin/dashboard");
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthWrapper>
      <h4 className="mb-2">¡Bienvenido a Cluv360! 👋🏻</h4>
      <p className="mb-4">Inicia sesión en tu cuenta y comienza la aventura.</p>

      <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo o usuario
          </label>
          <input
            type="email"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            name="email"
            placeholder="Introduce tu correo electrónico"
            required
            autoFocus
          />
        </div>
        <div className="mb-3 form-password-toggle">
          <div className="d-flex justify-content-between">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            {/* <Link aria-label="Go to Forgot Password Page" to="/auth/forgot-password">
              <small>¿Has olvidado tu contraseña?</small>
            </Link> */}
          </div>
          <div className="input-group input-group-merge">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="true"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              name="password"
              placeholder="••••••••"
              required
              aria-describedby="password"
            />
            <span className="input-group-text cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
              <i className={showPassword ? "bx bx-show" : "bx bx-hide"}></i>
            </span>
          </div>
        </div>
        <div className="mb-3">
          <button aria-label="Click me" className="btn btn-primary d-grid w-100" type="submit" disabled={loading}>
            <div>
              {loading && (
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              Iniciar Sesión
            </div>
          </button>
        </div>
      </form>
    </AuthWrapper>
  );
};
