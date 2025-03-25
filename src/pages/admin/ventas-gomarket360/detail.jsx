import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import { formatDate } from "../../../utils/dateFormatter";
import NumberFormatter from "../../../components/NumberFormatter";
import { useAdmin } from "../../../layouts/contexts/AdminContext";
import { confirmAlert } from "react-confirm-alert";

export const Detail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const { showLoading, hideLoading, setRefreshOrdersCount } = useAdmin();
  const deliveryStatus = [
    {
      value: "pending",
      name: "Pendiente",
    },
    {
      value: "on_review",
      name: "En revisión",
    },
    {
      value: "on_delivery",
      name: "Procesando envío",
    },
    {
      value: "delivered",
      name: "Entregado",
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    showOrder();
  }, []);

  const showOrder = () => {
    setIsLoading(true);
    apiClient
      .get(`/admin/orders/show/${id}`)
      .then((response) => {
        if (response.data.success) {
          setOrder(response.data.data);
          setStatus(response.data.data.delivery_status);
          setRefreshOrdersCount((prev) => !prev);
        } else {
          showNotification(response.data.message, "error");
        }
      })
      .catch((error) => {
        showNotification(error.response?.data?.message || "Error al consultar pedido", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStatus = (e) => {
    e.preventDefault();
    const status = e.target.value;
    confirmAlert({
      title: "Confirmar estado de envío",
      message: "¿Estás seguro que deseas actualizar el estado del envío?",
      buttons: [
        {
          label: "Sí, actualizar",
          onClick: async () => {
            setStatus(status);
            const data = {
              order_id: id,
              status: status,
            };

            showLoading();

            await apiClient
              .post("/admin/orders/update_delivery_status", data)
              .then((response) => {
                if (response.data.success) {
                  showOrder();
                  showNotification(response.data.message, "success");
                } else {
                  showNotification(response.data.message, "error");
                }
              })
              .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar estado de entrega", "error");
              })
              .finally(() => {
                hideLoading();
              });
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  const downloadComprobante = async () => {
    try {
      const response = await apiClient.get(`/admin/invoice/seller/${id}`, {
        responseType: "blob",
      });

      const disposition = response.headers["content-disposition"];
      let fileName = "comprobante.pdf";

      if (disposition && disposition.includes("filename=")) {
        const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          fileName = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrió un error al descargar comprobante", "error");
    }
  };

  return (
    <>
      {!isLoading && order ? (
        <div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 row-gap-4">
            <div className="d-flex flex-column justify-content-center">
              <div className="mb-1">
                <span className="h5">Pedido #{order.code} </span>
                <span className={`badge bg-label-${order.payment_status.color} me-1 ms-2`}>
                  {order.payment_status.name}
                </span>{" "}
                {/* <span className="badge bg-label-info">Pendiente</span> */}
              </div>
              <p className="mb-0">{formatDate(order.created_at)}</p>
            </div>
            {/* <div className="d-flex align-content-center flex-wrap gap-2">
              <button className="btn btn-danger">Eliminar pedido</button>
            </div> */}
          </div>
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="card mb-3">
                <div className="row card-header border-bottom mx-0 px-3">
                  <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto px-3">
                    <h5 className="card-title mb-0">Detalles del pedido</h5>
                  </div>
                  {/* <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto px-3">
                    <h6 className="m-0">
                      <a href=" javascript:void(0)">Edit</a>
                    </h6>
                  </div> */}
                </div>
                <div className="table-responsive text-nowrap pt-2 ps-3 pe-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Puntos</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.details.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex justify-content-start align-items-center text-nowrap">
                              <div className="avatar-wrapper">
                                <div className="avatar me-3">
                                  <img
                                    src={item.product?.thumbnail_img || import.meta.env.VITE_URL_PRODUCTO}
                                    alt="product-bot-found"
                                    className="rounded-2"
                                  />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <h6 className="text-body mb-0">{item.product?.name || "Producto no encontrado"}</h6>
                                <small>{item.variation}</small>
                              </div>
                            </div>
                          </td>
                          <td>{item.earn_point}</td>
                          <td>{item.quantity}</td>
                          <td>
                            S/<NumberFormatter value={item.price / item.quantity}></NumberFormatter>
                          </td>
                          <td>S/{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end align-items-center m-5 mb-4">
                  <div className="order-calculations">
                    <div className="d-flex justify-content-start mb-2">
                      <span className="w-px-200 text-heading">Subtotal:</span>
                      <h6 className="mb-0">{order.subtotal}</h6>
                    </div>
                    <div className="d-flex justify-content-start mb-2">
                      <span className="w-px-200 text-heading">Envio:</span>
                      <h6 className="mb-0">{order.envio}</h6>
                    </div>
                    <div className="d-flex justify-content-start mb-2">
                      <span className="w-px-200 text-heading">Descuento:</span>
                      <h6 className="mb-0">{order.discount}</h6>
                    </div>
                    <div className="d-flex justify-content-start mb-2">
                      <span className="w-px-200 text-heading">Gran Total:</span>
                      <h6 className="mb-0">{order.grand_total}</h6>
                    </div>
                    <div className="d-flex justify-content-start">
                      <span className="w-px-200 text-heading">Puntos Acumulados:</span>
                      <h6 className="mb-0">{order.earn_point}</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="form-group">
                  <label className="form-label">Estado del envío</label>
                  <select name="delivery_status" className="form-select" value={status} onChange={handleStatus}>
                    {deliveryStatus.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-4">
                  <button type="button" className="btn btn-info" onClick={() => downloadComprobante()}>
                    <i className="bx bxs-download me-1"></i> Descargar Comprobante
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card mb-3">
                <div className="card-header">
                  <h5 className="card-title m-0">Detalles del cliente</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-start align-items-center mb-4">
                    <div className="avatar me-3">
                      <img src={order.customer_details.avatar_original} alt="Avatar" className="rounded-circle" />
                    </div>
                    <div className="d-flex flex-column">
                      <a href="app-user-view-account.html" className="text-body text-nowrap">
                        <h6 className="mb-0">
                          {order.customer_details.username + " " + order.customer_details.surname}
                        </h6>
                      </a>
                      <span>Código: {order.customer_details.referral_code}</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">Información de contacto</h6>
                    {/* <h6 className="mb-1">
                      <a href=" javascript:void(0)" data-bs-toggle="modal" data-bs-target="#editUser">
                        Editar
                      </a>
                    </h6> */}
                  </div>
                  <p className="pt-1 mb-0">DNI: {order.customer_details.tax_id}</p>
                  <p className="mb-0">Correo: {order.customer_details.email}</p>
                  <p className="mb-0">Teléfono: {order.customer_details.phone}</p>
                  {order.entrega_domicilio && <p className="mb-0">Entrega a domicilio: {order.entrega_domicilio}</p>}
                  {order.punto_recogo && <p className="mb-0">Punto de recojo: {order.punto_recogo}</p>}
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-header">
                  <h5 className="card-title m-0">Detalles del patrocinador</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-start align-items-center mb-4">
                    <div className="avatar me-3">
                      <img src={order.patrocinador_details.avatar_original} alt="Avatar" className="rounded-circle" />
                    </div>
                    <div className="d-flex flex-column">
                      <a href="app-user-view-account.html" className="text-body text-nowrap">
                        <h6 className="mb-0">
                          {order.patrocinador_details.username + " " + order.patrocinador_details.surname}
                        </h6>
                      </a>
                      <span>Código: {order.patrocinador_details.referral_code}</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">Información de contacto</h6>
                  </div>
                  <p className="pt-1 mb-0">Teléfono: {order.patrocinador_details.phone}</p>
                </div>
              </div>
              <div className="card mb-6">
                <div className="card-header d-flex justify-content-between">
                  <h5 className="card-title m-0">Detalles del pedido</h5>
                </div>
                <div className="card-body">
                  <p className="pt-1 mb-0">Código de compra: {order.code}</p>
                  <p className="pt-1 mb-0">
                    Estado de pago:{" "}
                    <span className={`badge bg-label-${order.payment_status.color} me-1 ms-2`}>
                      {order.payment_status.name}
                    </span>
                  </p>
                  <p className="pt-1 mb-0">
                    Estado de envío:{" "}
                    <span className={`badge bg-label-${order.status.color} me-1 ms-2`}>{order.status.name}</span>
                  </p>
                  <p className="pt-1 mb-0">Monto Total: {order.subtotal}</p>
                  <p className="pt-1 mb-0">Método de pago: {order.payment_type}</p>
                </div>
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
