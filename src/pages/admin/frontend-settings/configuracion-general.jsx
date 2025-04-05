import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const Index = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/admin/generalsettings");
        setFormData(response.data.data);
      } catch (error) {
        showNotification("Error al consultar la configuración", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiClient.post(`/admin/generalsettings`, formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar la configuración", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
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
            <h5 className="mb-0 text-md-start text-center">Configuración General</h5>
          </div>
        </div>
        <div className="card-body">
          {!formData ? (
            <p className="text-center">Cargando información...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Nombre del sitio</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">DIRECCIÓN</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Texto de pie de página</label>
                <div className="col-sm-10">
                  <textarea className="form-control" name="description" onChange={handleInputChange} required>
                    {formData.description}
                  </textarea>
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
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Correo electrónico</label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Facebook</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Instagram</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Twitter</label>
                <div className="col-sm-10">
                  <input
                    type="Guardar"
                    className="form-control"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Youtube</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row justify-content-end">
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
          )}
        </div>
      </div>
    </>
  );
};
