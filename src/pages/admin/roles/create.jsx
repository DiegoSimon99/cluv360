import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import "react-quill/dist/quill.snow.css";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });

  const fields = [
    {
      label: "Productos",
      value: 1,
    },
    {
      label: "Flash Deal",
      value: 2,
    },
    {
      label: "Orders",
      value: 3,
    },
    {
      label: "Ventas",
      value: 4,
    },
    {
      label: "Sellers",
      value: 5,
    },
    {
      label: "Customers",
      value: 6,
    },
    {
      label: "Mensajería",
      value: 7,
    },
    {
      label: "Business Settings",
      value: 8,
    },
    {
      label: "Configuracion Visual",
      value: 9,
    },
    {
      label: "Staffs",
      value: 10,
    },
    {
      label: "SEO Setting",
      value: 11,
    },
    {
      label: "E-commerce Setup",
      value: 12,
    },
    {
      label: "Sistema de soporte",
      value: 13,
    },
    {
      label: "Orden de punto de recogida",
      value: 14,
    },
    {
      label: "Administrador de complementos",
      value: 15,
    },
    {
      label: "Proyectos",
      value: 16,
    },
  ];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      permissions: permissions,
    };

    try {
      setLoading(true);
      const response = await apiClient.post(`/admin/roles/store`, dataToSend);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/roles");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar rol", "error");
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

  const handlePermissionChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setPermissions((prev) => {
      if (isChecked) {
        return [...prev, value];
      } else {
        return prev.filter((item) => item !== value);
      }
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Información de Rol</h5>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
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
              <label className="col-sm-2 col-form-label">Permisos</label>
              <div className="col-sm-10 pt-2">
                {fields.map((item, key) => (
                  <div key={key} className="d-flex mb-2">
                    <div className="flex-grow-1 row">
                      <div className="col-9 mb-sm-0 mb-2">
                        <small className="text-muted">{item.label}</small>
                      </div>
                      <div className="col-3 text-end">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input float-end"
                            type="checkbox"
                            role="switch"
                            value={item.value.toString()}
                            checked={permissions.includes(item.value.toString())}
                            onChange={handlePermissionChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
        </div>
      </div>
    </>
  );
};
