import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const Index = () => {
  const [loading, setLoading] = useState(false);
  const [settings1, setSettings1] = useState({
    otp_for_order: 0,
  });
  const settingLabels1 = {
    otp_for_order: "Colocación de pedidos",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/admin/otp-configuration");
        const data = response.data.data;
        setSettings1({ otp_for_order: data.otp_for_order });
      } catch (error) {
        showNotification("Error al obtener la configuración", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle1 = async (key) => {
    const newValue = settings1[key] === 1 ? 0 : 1;

    setSettings1((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    const data = {
      type: key,
      value: newValue,
    };
    try {
      const response = await apiClient.post("/admin/otp-configuration/update", data);
      showNotification(response.data.message, "success");
    } catch (error) {
      showNotification("Error al actualizar configuración", "error");
    }
  };

  return (
    <>
      {!loading ? (
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card">
              <h5 className="card-header">El OTP se utilizará para</h5>
              <div className="card-body">
                {Object.keys(settings1).map((key) => (
                  <div key={key} className="d-flex mb-3">
                    <div className="flex-grow-1 row">
                      <div className="col-9 mb-sm-0 mb-2">
                        <small className="text-muted">{settingLabels1[key]}</small>
                      </div>
                      <div className="col-3 text-end">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input float-end"
                            type="checkbox"
                            role="switch"
                            checked={settings1[key] === 1}
                            onChange={() => handleToggle1(key)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Cargando Información...</p>
        </div>
      )}
    </>
  );
};
