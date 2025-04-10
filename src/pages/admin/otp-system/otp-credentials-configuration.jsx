import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const Index = () => {
  const [loadingNexmo, setLoadingNexmo] = useState(false);
  const [loadingWebhooksms, setLoadingWebhooksms] = useState(false);
  const [formDataNexmo, setFormDataNexmo] = useState(null);
  const [formDataWebhooksms, setFormDataWebhooksms] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/admin/otp-credentials-configuration");
        const data = response.data.data;
        setFormDataNexmo(data.nexmo);
        setFormDataWebhooksms(data.webhooksms);
      } catch (error) {
        showNotification("Error al obtener la configuración", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmitNexmo = async (e) => {
    e.preventDefault();

    try {
      setLoadingNexmo(true);
      const data = {
        type: "nexmo",
        types: ["NEXMO_KEY", "NEXMO_SECRET"],
        ...formDataNexmo,
      };

      const response = await apiClient.post("/admin/otp-credentials-configuration/update", data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar configuración", "error");
    } finally {
      setLoadingNexmo(false);
    }
  };

  const handleSubmitWebhooksms = async (e) => {
    e.preventDefault();

    try {
      setLoadingWebhooksms(true);
      const data = {
        type: "webhooksms",
        ...formDataWebhooksms,
      };

      const response = await apiClient.post("/admin/otp-credentials-configuration/update", data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar configuración", "error");
    } finally {
      setLoadingWebhooksms(false);
    }
  };

  const handleChangeNexmo = (e) => {
    const { name, type, checked, value } = e.target;

    setFormDataNexmo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleChangeWebhooksms = (e) => {
    const { name, type, checked, value } = e.target;

    setFormDataWebhooksms((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 mb-3">
          <div className="card">
            <div className="card-header align-items-center row">
              <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                <h5 className="mb-0 text-md-start text-center">Nexmo Credential</h5>
              </div>
            </div>
            <div className="card-body">
              {formDataNexmo ? (
                <form onSubmit={handleSubmitNexmo}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">NEXMO KEY</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="NEXMO_KEY"
                        value={formDataNexmo.NEXMO_KEY}
                        onChange={handleChangeNexmo}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">NEXMO SECRET</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="NEXMO_SECRET"
                        value={formDataNexmo.NEXMO_SECRET}
                        onChange={handleChangeNexmo}
                        required
                      />
                    </div>
                  </div>
                  <div className="row justify-content-end mt-4 mt-md-0">
                    <div className="col-sm-10 text-end">
                      <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loadingNexmo}>
                        {loadingNexmo && (
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
        <div className="col-12 col-md-6 mb-3">
          <div className="card">
            <div className="card-header align-items-center row">
              <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                <h5 className="mb-0 text-md-start text-center">Webhooksms Credential</h5>
              </div>
            </div>
            <div className="card-body">
              {formDataWebhooksms ? (
                <form onSubmit={handleSubmitWebhooksms}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">api key</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="api_key_webhooksms"
                        value={formDataWebhooksms.api_key_webhooksms}
                        onChange={handleChangeWebhooksms}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">SECRET</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="secret_webhooksms"
                        value={formDataWebhooksms.secret_webhooksms}
                        onChange={handleChangeWebhooksms}
                        required
                      />
                    </div>
                  </div>
                  <div className="row justify-content-end mt-4 mt-md-0">
                    <div className="col-sm-10 text-end">
                      <button
                        aria-label="Click me"
                        type="submit"
                        className="btn btn-primary"
                        disabled={loadingWebhooksms}
                      >
                        {loadingWebhooksms && (
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
