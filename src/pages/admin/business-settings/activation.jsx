import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const Activation = () => {
  const [loading, setLoading] = useState(false);
  const [settings1, setSettings1] = useState({
    classified_product: 0,
  });
  const [settings2, setSettings2] = useState({
    vendor_system_activation: 0,
    wallet_system: 0,
    coupon_system: 0,
    pickup_point: 0,
    conversation_system: 0,
    guest_checkout_active: 0,
    category_wise_commission: 0,
    email_verification: 0,
  });
  const [settings3, setSettings3] = useState({
    wallet_payment: 0,
    payme_payment: 0,
    paypal_payment: 0,
    stripe_payment: 0,
    sslcommerz_payment: 0,
    instamojo_payment: 0,
    razorpay: 0,
    cash_payment: 0,
  });

  const settingLabels1 = {
    classified_product: "Producto Clasificado",
  };

  const settingLabels2 = {
    vendor_system_activation: "Activación del sistema del proveedor",
    wallet_system: "Activación del sistema de billetera",
    coupon_system: "Activación del sistema de cupones",
    pickup_point: "Activación del punto de recogida",
    conversation_system: "Activación de la conversación",
    guest_checkout_active: "Activación del pago como invitado",
    category_wise_commission: "Comisión por categoría",
    email_verification: "Verificación de correo electrónico",
  };

  const settingLabels3 = {
    wallet_payment: "Activación de pago de billetera",
    payme_payment: "Activación de pago de Payme",
    paypal_payment: "Activación de pago de PayPal",
    stripe_payment: "Activación de pago de franjas",
    sslcommerz_payment: "Activación de SSlCommerz",
    instamojo_payment: "Activación de pago de Instamojo",
    razorpay: "Activación de Razor Pay",
    cash_payment: "Activación de pago en efectivo",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/admin/business-settings/activation");
        const data = response.data.data;
        setSettings1({ classified_product: data.classified_product });
        setSettings2({
          vendor_system_activation: data.vendor_system_activation,
          wallet_system: data.wallet_system,
          coupon_system: data.coupon_system,
          pickup_point: data.pickup_point,
          conversation_system: data.conversation_system,
          guest_checkout_active: data.guest_checkout_active,
          category_wise_commission: data.category_wise_commission,
          email_verification: data.email_verification,
        });
        setSettings3({
          wallet_payment: data.wallet_payment,
          payme_payment: data.payme_payment,
          paypal_payment: data.paypal_payment,
          stripe_payment: data.stripe_payment,
          sslicommerz_payment: data.sslicommerz_payment,
          instamojo_payment: data.instamojo_payment,
          razorpay: data.razorpay,
          cash_payment: data.cash_payment,
        });
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

    // Actualiza el estado local
    setSettings1((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    const data = {
      type: key,
      value: newValue,
    };
    try {
      const response = await apiClient.post("/admin/business-settings/activation/update", data);
      showNotification(response.data.message, "success");
    } catch (error) {
      showNotification("Error al actualizar configuración", "error");
    }
  };

  const handleToggle2 = async (key) => {
    const newValue = settings2[key] === 1 ? 0 : 1;

    // Actualiza el estado local
    setSettings2((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    const data = {
      type: key,
      value: newValue,
    };
    try {
      const response = await apiClient.post("/admin/business-settings/activation/update", data);
      showNotification(response.data.message, "success");
    } catch (error) {
      showNotification("Error al actualizar configuración", "error");
    }
  };

  const handleToggle3 = async (key) => {
    const newValue = settings3[key] === 1 ? 0 : 1;

    // Actualiza el estado local
    setSettings3((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    const data = {
      type: key,
      value: newValue,
    };
    try {
      const response = await apiClient.post("/admin/business-settings/activation/update", data);
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
              <h5 className="card-header">Activar producto clasificado</h5>
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

          <div className="col-md-6 col-12 mb-3">
            <div className="card">
              <h5 className="card-header">Relacionado con el negocio</h5>
              <div className="card-body">
                {Object.keys(settings2).map((key) => (
                  <div key={key} className="d-flex mb-3">
                    <div className="flex-grow-1 row">
                      <div className="col-9 mb-sm-0 mb-2">
                        <small className="text-muted">{settingLabels2[key]}</small>
                      </div>
                      <div className="col-3 text-end">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input float-end"
                            type="checkbox"
                            role="switch"
                            checked={settings2[key] === 1}
                            onChange={() => handleToggle2(key)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6 col-12 mb-3">
            <div className="card">
              <h5 className="card-header">Relacionado con el pago</h5>
              <div className="card-body">
                {Object.keys(settings3).map((key) => (
                  <div key={key} className="d-flex mb-3">
                    <div className="flex-grow-1 row">
                      <div className="col-9 mb-sm-0 mb-2">
                        <small className="text-muted">{settingLabels3[key]}</small>
                      </div>
                      <div className="col-3 text-end">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input float-end"
                            type="checkbox"
                            role="switch"
                            checked={settings3[key] === 1}
                            onChange={() => handleToggle3(key)}
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
