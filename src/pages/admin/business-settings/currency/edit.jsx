import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";

export const Edit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    code: "",
    exchange_rate: "",
    compra_usd: "",
    venta_usd: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get(`/admin/currency/${id}`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setFormData(data);
        } else {
          showNotification(response.data.message, "error");
        }
      })
      .catch((error) => {
        showNotification(error.response?.data?.message || "Error al consultar moneda", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await apiClient.patch(`/admin/currency/${id}`, formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/currency");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar moneda", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "exchange_rate" || name === "compra_usd" || name === "venta_usd") {
      const decimalRegex = /^\d*\.?\d*$/;
      if (!decimalRegex.test(value)) {
        return;
      }
    }

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
            <h5 className="mb-0 text-md-start text-center">Información de moneda</h5>
          </div>
        </div>
        <div className="card-body">
          {formData.name != "" ? (
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
                <label className="col-sm-2 col-form-label">Símbolo</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Código</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Tipo de cambio</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="exchange_rate"
                    value={formData.exchange_rate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Compra USD</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="compra_usd"
                    value={formData.compra_usd}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Venta USD</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="venta_usd"
                    value={formData.venta_usd}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-end mt-4 mt-md-0">
                <div className="col-sm-10 text-end">
                  <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Guardar"
                    )}
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
