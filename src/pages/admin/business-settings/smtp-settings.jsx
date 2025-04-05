import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const SmtSettings = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    types: [
      "MAIL_MAILER",
      "MAIL_HOST",
      "MAIL_PORT",
      "MAIL_USERNAME",
      "MAIL_PASSWORD",
      "MAIL_ENCRYPTION",
      "MAIL_FROM_ADDRESS",
      "MAIL_FROM_NAME",
      "MAILGUN_DOMAIN",
      "MAILGUN_SECRET",
    ],
    MAIL_MAILER: "",
    MAIL_HOST: "",
    MAIL_PORT: "",
    MAIL_USERNAME: "",
    MAIL_PASSWORD: "",
    MAIL_ENCRYPTION: "",
    MAIL_FROM_ADDRESS: "",
    MAIL_FROM_NAME: "",
    MAILGUN_DOMAIN: "",
    MAILGUN_SECRET: "",
  });

  const mailDriver = [
    {
      value: "sendmail",
      name: "Sendmail",
    },
    {
      value: "smtp",
      name: "SMTP",
    },
    {
      value: "mailgun",
      name: "Mailgun",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/admin/business-settings/smtp");
        const data = response.data.data;
        setFormData((prev) => ({
          ...prev,
          MAIL_MAILER: data.MAIL_MAILER,
          MAIL_HOST: data.MAIL_HOST,
          MAIL_PORT: data.MAIL_PORT,
          MAIL_USERNAME: data.MAIL_USERNAME,
          MAIL_PASSWORD: data.MAIL_PASSWORD,
          MAIL_ENCRYPTION: data.MAIL_ENCRYPTION,
          MAIL_FROM_ADDRESS: data.MAIL_FROM_ADDRESS,
          MAIL_FROM_NAME: data.MAIL_FROM_NAME,
          MAILGUN_DOMAIN: data.MAILGUN_DOMAIN,
          MAILGUN_SECRET: data.MAILGUN_SECRET,
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
      const response = await apiClient.post("/admin/business-settings/smtp-update", formData);
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-12 mb-3">
          <div className="card">
            <div className="card-header align-items-center row">
              <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                <h5 className="mb-0 text-md-start text-center">SMTP Settings</h5>
              </div>
            </div>
            <div className="card-body">
              {!isLoading ? (
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">MAIL MAILER</label>
                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        name="MAIL_MAILER"
                        value={formData.MAIL_MAILER}
                        onChange={handleChange}
                      >
                        {mailDriver.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.MAIL_MAILER == "mailgun" ? (
                    <div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAILGUN DOMAIN</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAILGUN_DOMAIN"
                            value={formData.MAILGUN_DOMAIN}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAILGUN SECRET</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAILGUN_SECRET"
                            value={formData.MAILGUN_SECRET}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL HOST</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_HOST"
                            value={formData.MAIL_HOST}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL PORT</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_PORT"
                            value={formData.MAIL_PORT}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL USERNAME</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_USERNAME"
                            value={formData.MAIL_USERNAME}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL PASSWORD</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_PASSWORD"
                            value={formData.MAIL_PASSWORD}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL ENCRYPTION</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_ENCRYPTION"
                            value={formData.MAIL_ENCRYPTION}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL FROM ADDRESS</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_FROM_ADDRESS"
                            value={formData.MAIL_FROM_ADDRESS}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">MAIL FROM NAME</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="MAIL_FROM_NAME"
                            value={formData.MAIL_FROM_NAME}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
