import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const PaymentMethod = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    payment_method: "paypal",
    types: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"],
    PAYPAL_CLIENT_ID: "",
    PAYPAL_CLIENT_SECRET: "",
    paypal_sandbox: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/admin/business-settings/payment-method");
        const data = response.data.data;
        setFormData((prev) => ({
          ...prev,
          PAYPAL_CLIENT_ID: data.PAYPAL_CLIENT_ID,
          PAYPAL_CLIENT_SECRET: data.PAYPAL_CLIENT_SECRET,
          paypal_sandbox: data.paypal_sandbox,
        }));
      } catch (error) {
        showNotification("Error al obtener la configuración", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await apiClient.post("/admin/business-settings/payment-method-update", formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar configuración", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-12 mb-3">
          <div className="card">
            <div className="card-header align-items-center row">
              <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                <h5 className="mb-0 text-md-start text-center">Paypal Credential</h5>
              </div>
            </div>
            <div className="card-body">
              {!isLoading ? (
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Paypal Client Id</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="PAYPAL_CLIENT_ID"
                        value={formData.PAYPAL_CLIENT_ID}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Paypal Client Secret</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="PAYPAL_CLIENT_SECRET"
                        value={formData.PAYPAL_CLIENT_SECRET}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Paypal Sandbox Mode</label>
                    <div className="col-sm-9 d-flex align-items-center">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          name="paypal_sandbox"
                          checked={formData.paypal_sandbox === 1}
                          onChange={handleChange}
                        />
                      </div>
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
        </div>
      </div>
    </>
  );
};
