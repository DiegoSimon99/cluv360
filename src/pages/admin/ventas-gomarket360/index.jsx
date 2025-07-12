import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import LoaderTable from "../../../components/admin/LoaderTable";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { useAdmin } from "../../../layouts/contexts/AdminContext";
import { showNotification } from "../../../utils/greetingHandler";
import { formatDate } from "../../../utils/dateFormatter";
import ModalInput from "../../../components/admin/ModalInput";

export const Index = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [paymentType, setPaymentType] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [search, setSearch] = useState("");
  const [filterPaymentType, setFilterPaymentType] = useState(null);
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState(null);
  const [paginate, setPaginate] = useState(10);
  const { showLoading, hideLoading } = useAdmin();
  const navigate = useNavigate();
  const user_type = localStorage.getItem("user_type");

  const listOrders = async () => {
    setOrders([]);
    try {
      setLoading(true);
      const data = {
        search: search,
        paginate: paginate,
        payment_type: filterPaymentType,
        delivery_status: filterDeliveryStatus,
      };
      const response = await apiClient.post(`admin/orders?page=${currentPage}`, data);
      setOrders(response.data.data);
      setTotalPages(response.data.last_page);
      setPerPage(response.data.per_page);
      setCurrentPageTable(response.data.current_page);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al listar pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dataPaymentType = [
      {
        value: "paid",
        name: "Pagado",
      },
      {
        value: "unpaid",
        name: "No pagado",
      },
    ];
    setPaymentType(dataPaymentType);

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
    setDeliveryStatus(deliveryStatus);
  }, []);

  useEffect(() => {
    listOrders();
  }, [currentPage, search, paginate, filterPaymentType, filterDeliveryStatus]);

  const getPagination = () => {
    const pages = [];
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    // Aseguramos que haya solo 4 botones más el "..."
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterSubmit = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterKeyup = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handleEntradaChange = (e) => {
    setPaginate(e.target.value);
    setCurrentPage(1);
  };

  const showOrder = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  const deleteOrder = (id) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este pedido?",
      buttons: [
        {
          label: "Sí, eliminar",
          onClick: async () => {
            try {
              showLoading();
              const response = await apiClient.delete(`/admin/orders/${id}`);
              if (response.data.success) {
                showNotification(response.data.message, "success");
                listOrders();
              } else {
                showNotification(response.data.message, "error");
              }
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al eliminar pedido", "error");
            } finally {
              hideLoading();
            }
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  const downloadComprobante = async (id) => {
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

  const handleFilter = (e) => {
    const { name, value } = e.target;
    if (name === "payment_type") {
      setFilterPaymentType(value);
    } else if (name === "delivery_status") {
      setFilterDeliveryStatus(value);
    }
    setCurrentPage(1);
  };

  const viewOrderPayment = async (id) => {
    setOrder(null);
    try {
      const response = await apiClient.get(`/admin/orders/order/${id}`);
      const res = response.data.data;
      const data = [
        {
          id: 1,
          numCol: 6,
          label: "token Id",
          input: res.tokenId,
        },
        {
          id: 2,
          numCol: 6,
          label: "purchase Number",
          input: res.purchaseNumber,
        },
        {
          id: 3,
          numCol: 6,
          label: "amount",
          input: res.amount,
        },
        {
          id: 4,
          numCol: 6,
          label: "installment",
          input: res.installment,
        },
        {
          id: 5,
          numCol: 6,
          label: "currency",
          input: res.currency,
        },
        {
          id: 6,
          numCol: 6,
          label: "authorized Amount",
          input: res.authorizedAmount,
        },
        {
          id: 7,
          numCol: 6,
          label: "authorization Code",
          input: res.authorizationCode,
        },
        {
          id: 8,
          numCol: 6,
          label: "action Code",
          input: res.actionCode,
        },
        {
          id: 9,
          numCol: 6,
          label: "trace Number",
          input: res.traceNumber,
        },
        {
          id: 10,
          numCol: 6,
          label: "transaction Date",
          input: res.transactionDate,
        },
        {
          id: 11,
          numCol: 6,
          label: "transaction Id",
          input: res.transactionId,
        },
      ];
      setOrder(data);
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrio un error al consultar orden", "error");
    }
  };

  const handleCloseModal = () => {
    setOrder(null);
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Ventas realizadas</h5>
          </div>
          <div className="col-12 col-md-2 mb-1">
            <label>Entradas</label>
            <select className="form-select" onChange={handleEntradaChange} value={paginate}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="col-12 col-md-3 mb-2">
            <br />
            <select className="form-select" name="payment_type" onChange={handleFilter} value={filterPaymentType}>
              <option value="">Filtrar por estado de pago</option>
              {paymentType.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-3 mb-2">
            <br />
            <select className="form-select" name="delivery_status" onChange={handleFilter} value={filterDeliveryStatus}>
              <option value="">Filtrar por estado de envio</option>
              {deliveryStatus.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-0 col-md-1 mb-1"></div>
          <div className="col-12 col-md-3 mb-1">
            <br />
            <div className="input-group input-group-merge">
              <span className="input-group-text" id="basic-addon-search31">
                <i className="bx bx-search"></i>
              </span>
              <input
                type="search"
                placeholder="Buscar código de orden.."
                className="form-control"
                value={search}
                onChange={handleFilterSubmit}
                onKeyUp={handleFilterKeyup}
              />
            </div>
          </div>
        </div>
        <div className="table-responsive pt-2 ps-4 pe-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Código de orden</th>
                {/* <th>Productos</th> */}
                <th>Cliente</th>
                <th>DNI</th>
                <th>Lugar</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método de pago</th>
                <th>Estado de Pago</th>
                <th>Estado de Envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={`table-border-bottom-0 ${loading ? "position-relative" : ""}`}>
              <LoaderTable loading={loading} cantidad={orders.length}></LoaderTable>
              {orders.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td style={{ minWidth: 270 }}>
                    <div className="d-flex justify-content-between">
                      {item.code}
                      {item.viewed == 0 && <span className="badge rounded-pill bg-label-success">Nuevo</span>}
                    </div>
                  </td>
                  {/* <td>{item.productos}</td> */}
                  <td>{item.cliente}</td>
                  <td>{item.dni}</td>
                  <td>{item.lugar}</td>
                  <td>{item.monto}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>{item.payment_type}</td>
                  <td>
                    <span className={`badge rounded-pill bg-label-${item.payment_status.color}`}>
                      {item.payment_status.name}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill text-bg-${item.status.color}`}>{item.status.name}</span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        aria-label="Click me"
                        type="button"
                        className="btn p-0 dropdown-toggle hide-arrow"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div className="dropdown-menu">
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          href="#"
                          onClick={() => showOrder(item.id)}
                        >
                          <i className="bx bx-show me-1"></i> Ver
                        </button>
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          href="#"
                          onClick={() => downloadComprobante(item.id)}
                        >
                          <i className="bx bxs-download me-1"></i> Descargar Comprobante
                        </button>
                        {item.payment_type.toLowerCase() === "niubiz" && (
                          <button
                            type="button"
                            aria-label="dropdown action option"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#modalOrder"
                            onClick={() => viewOrderPayment(item.id)}
                          >
                            <i className="bx bx-show me-1"></i> Ver Orden de Pago
                          </button>
                        )}
                        {user_type === "admin" && (
                          <button
                            aria-label="dropdown action option"
                            className="dropdown-item"
                            onClick={() => deleteOrder(item.id)}
                          >
                            <i className="bx bx-trash me-1"></i> Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-4">
              {/* Botón de primera página */}
              <li className="page-item first">
                <a aria-label="pagination link" className="page-link" href="#" onClick={() => handlePageChange(1)}>
                  <i className="tf-icon bx bx-chevrons-left"></i>
                </a>
              </li>

              {/* Botón de página anterior */}
              <li className="page-item prev">
                <a
                  aria-label="pagination link"
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="tf-icon bx bx-chevron-left"></i>
                </a>
              </li>

              {/* Botones de páginas numéricas */}
              {getPagination().map((page, index) =>
                page === "..." ? (
                  <li key={index} className="page-item">
                    <span className="page-link">...</span>
                  </li>
                ) : (
                  <li key={index} className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <a
                      aria-label="pagination link"
                      className="page-link"
                      href="#"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </a>
                  </li>
                )
              )}

              {/* Botón de página siguiente */}
              <li className="page-item next">
                <a
                  aria-label="pagination link"
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="tf-icon bx bx-chevron-right"></i>
                </a>
              </li>

              {/* Botón de última página */}
              <li className="page-item last">
                <a
                  aria-label="pagination link"
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(totalPages)}
                >
                  <i className="tf-icon bx bx-chevrons-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="modal fade" id="modalOrder" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Orden Niubiz</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {order === null ? (
                <p className="text-center">Cargando Orden...</p>
              ) : (
                <div className="row g-2">
                  <ModalInput items={order}></ModalInput>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
