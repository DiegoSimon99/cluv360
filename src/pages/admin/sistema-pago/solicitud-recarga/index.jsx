import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import { showNotification } from "../../../../utils/greetingHandler";
import LoaderTable from "../../../../components/admin/LoaderTable";
import { confirmAlert } from "react-confirm-alert";
import { useAdmin } from "../../../../layouts/contexts/AdminContext";
import { formatDate } from "../../../../utils/dateFormatter";
import NumberFormatter from "../../../../components/NumberFormatter";
import { Modal } from "react-bootstrap";
import ModalInput from "../../../../components/admin/ModalInput";

export const Index = () => {
  const [id, setId] = useState(null);
  const [manualPaymentMethods, setWalletRecharge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(10);
  const { showLoading, hideLoading } = useAdmin();
  const [order, setOrder] = useState(null);
  /*Modal ChangeVenta*/
  const [showChangeRecharge, setshowRecharge] = useState(false);
  const handleCloseChangeRecharge = () => setshowRecharge(false);
  const handleShowChangeRecharge = () => setshowRecharge(true);

  const [formData, setFormData] = useState({
    details: "",
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const listWalletRecharge = async () => {
    try {
      setWalletRecharge([]);
      setLoading(true);
      const data = {
        search: search,
        paginate: paginate,
      };
      const response = await apiClient.post(`admin/offline-wallet-recharge-requests?page=${currentPage}`, data);
      setWalletRecharge(response.data.data);
      setTotalPages(response.data.last_page);
      setPerPage(response.data.per_page);
      setCurrentPageTable(response.data.current_page);
    } catch (error) {
      showNotification(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listWalletRecharge();
  }, [currentPage, search, paginate]);

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

  const deleteWalletRecharge = (id) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro que deseas eliminar esta solicitud de recarga?",
      buttons: [
        {
          label: "Sí, eliminar",
          onClick: async () => {
            try {
              showLoading();
              const response = await apiClient.delete(`/admin/offline-wallet-recharge-requests/${id}`);
              if (response.data.success) {
                showNotification(response.data.message, "success");
                listWalletRecharge();
              } else {
                showNotification(response.data.message, "error");
              }
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al eliminar solicitud de recarga", "error");
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

  const modalApproval = (wallet_id) => {
    setId(wallet_id);
    handleShowChangeRecharge();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await apiClient.post(`/admin/offline-wallet-recharge-requests/approved/${id}`, formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        handleCloseChangeRecharge();
        listWalletRecharge();
        setFormData({
          details: "",
        });
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrio un error al aprobar recargar", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const viewOrderPayment = async (wallet_id) => {
    setOrder(null);
    try {
      const response = await apiClient.get(`/admin/offline-wallet-recharge-requests/${wallet_id}`);
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
            <h5 className="mb-0 text-md-start text-center">Solicitudes de recarga de billetera</h5>
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
          <div className="col-0 col-md-8 mb-1"></div>
          <div className="col-12 col-md-2 mb-1">
            <br />
            <div className="input-group input-group-merge">
              <span className="input-group-text" id="basic-addon-search31">
                <i className="bx bx-search"></i>
              </span>
              <input
                type="search"
                placeholder="Buscar.."
                className="form-control"
                value={search}
                onChange={handleFilterSubmit}
                onKeyUp={handleFilterKeyup}
              />
            </div>
          </div>
        </div>
        <div className="table-responsive text-nowrap pt-2 ps-4 pe-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Moneda</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Tipo</th>
                <th>TXN ID</th>
                <th>Foto</th>
                <th>Aprobación</th>
                <th>Detalles</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={`table-border-bottom-0 ${loading ? "position-relative" : ""}`}>
              <LoaderTable loading={loading} cantidad={manualPaymentMethods.length}></LoaderTable>
              {manualPaymentMethods.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td>{item.username + " " + item.surname}</td>
                  <td>{item.currency_code}</td>
                  <td>
                    <NumberFormatter value={item.amount}></NumberFormatter>
                  </td>
                  <td>{item.payment_method}</td>
                  <td>{item.tipo_abono}</td>
                  <td>{item.voucher}</td>
                  <td>
                    {item.voucher ? (
                      <a href={item.reciept} target="_blank" rel="noopener noreferrer">
                        Ver Recibo
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {item.approval == 0 ? (
                      <button type="button" className="btn btn-primary" onClick={() => modalApproval(item.id)}>
                        Aprobar
                      </button>
                    ) : (
                      "APROBADO"
                    )}
                  </td>
                  <td>{item.details}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    {(item.payment_method == "niubiz" || item.approval == 0) && (
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
                          {item.payment_method.toLowerCase() === "niubiz" && (
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
                          {item.approval == 0 && (
                            <button
                              aria-label="dropdown action option"
                              type="button"
                              className="dropdown-item"
                              onClick={() => deleteWalletRecharge(item.id)}
                            >
                              <i className="bx bx-trash me-1"></i> Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    )}
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

      <Modal show={showChangeRecharge} onHide={handleCloseChangeRecharge} centered>
        <Modal.Header closeButton>
          <h5 className="modal-title">Aprobar Recarga</h5>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-12 mb-2">
                <label className="form-label">Observaciones</label>
                <input
                  type="text"
                  className="form-control"
                  name="details"
                  value={formData.details}
                  onChange={handleChangeForm}
                  required
                />
              </div>
              <div className="col-12 mb-2">
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading && (
                    <div>
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                  Enviar
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

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
