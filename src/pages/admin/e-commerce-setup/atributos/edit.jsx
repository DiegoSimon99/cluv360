import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";

export const Edit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/admin/attributes/${id}`);
        setFormData(response.data.data);
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar atributo", "error");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await apiClient.patch(`/admin/attributes/${id}`, formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/attributes");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar atributo", "error");
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
            <h5 className="mb-0 text-md-start text-center">Información de atributos</h5>
          </div>
        </div>
        <div className="card-body">
          {formData ? (
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
