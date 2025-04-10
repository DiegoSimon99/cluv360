import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import "react-quill/dist/quill.snow.css";

export const Edit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState(null);
  const [formData, setFormData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get("/admin/staffs/roles");
        setRoles(response.data.data);
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al listar roles", "error");
      }
    };
    fetchRoles();

    const fetchStaff = async () => {
      try {
        const response = await apiClient.get(`/admin/staffs/edit/${id}`);
        if (response.data.success) {
          setFormData(response.data.data);
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar personal", "error");
      }
    };
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      showNotification("Correo electrónico inválido", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.patch(`/admin/staffs/${id}`, formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/staffs");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar personal", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Información del Personal</h5>
          </div>
        </div>
        <div className="card-body">
          {roles && formData ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Nombre</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Correo</label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Teléfono</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Contraseña</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Rol</label>
                <div className="col-sm-10">
                  <select
                    name="role_id"
                    className="form-select"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {roles.map((item, key) => (
                      <option key={key} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row justify-content-end mt-4 mt-md-0">
                <div className="col-sm-10 text-end">
                  <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loading}>
                    {loading && (
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p>Cargando Información...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
