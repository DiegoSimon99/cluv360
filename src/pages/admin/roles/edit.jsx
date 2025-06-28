import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import "react-quill/dist/quill.snow.css";

export const Edit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [formData, setFormData] = useState(null);

  const fields = [
    {
      label: "POS Manager",
      value: 1,
    },
    {
      label: "Cierre Premium",
      value: 2,
    },
    {
      label: "Asociados",
      value: 3,
    },
    {
      label: "Ver Movimientos",
      value: 4,
    },
    {
      label: "Ingresar Venta",
      value: 5,
    },
    {
      label: "Proyectos",
      value: 6,
    },
    {
      label: "Generar Descuento",
      value: 7,
    },
    {
      label: "Red de Afiliados",
      value: 8,
    },
    {
      label: "Plantilla de correos",
      value: 9,
    },
    {
      label: "Red Social",
      value: 10,
    },
    {
      label: "Configuración MLM",
      value: 11,
    },
    {
      label: "Productos",
      value: 12,
    },
    {
      label: "Publicaciones",
      value: 13,
    },
    {
      label: "Ventas GoMarket360",
      value: 14,
    },
    {
      label: "Cobro de Comisiones",
      value: 15,
    },
    {
      label: "Lista de Vendedores",
      value: 16,
    },
    {
      label: "Paquetes Clasificados",
      value: 17,
    },
    {
      label: "Business Settings",
      value: 18,
    },
    {
      label: "Frontend Settings",
      value: 19,
    },
    {
      label: "E-commerce Setup",
      value: 20,
    },
    {
      label: "Sistema de pago fuera de línea",
      value: 21,
    },
    {
      label: "OTP System",
      value: 22,
    },
    {
      label: "Sistema de soporte",
      value: 23,
    },
    {
      label: "Staffs",
      value: 24,
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await apiClient.get(`/admin/roles/${id}`);
        const data = response.data.data;
        setFormData({
          name: data.name,
        });
        setPermissions(data.permissions);
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al consultar rol", "error");
      }
    };
    fetchRol();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      permissions: permissions,
    };

    try {
      setLoading(true);
      const response = await apiClient.patch(`/admin/roles/${id}`, dataToSend);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/roles");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar rol", "error");
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
          {formData ? (
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
