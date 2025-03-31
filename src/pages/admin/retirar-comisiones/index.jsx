import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import LoaderTable from "../../../components/admin/LoaderTable";
import { formatDate } from "../../../utils/dateFormatter";
import { showNotification } from "../../../utils/greetingHandler";
import Modal from "react-bootstrap/Modal";
import ModalInput from "../../../components/admin/ModalInput";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export const Index = () => {
  const [comisiones, setComisiones] = useState([]);
  const [retiro_id, setRetiroId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(10);
  const [dataUser, setDataUser] = useState(null);
  const [dataCuentaBancaria, setDataCuentaBancaria] = useState(null);
  const [showRetiro, setshowRetiro] = useState(false);
  const handleCloseRetiro = () => setshowRetiro(false);
  const handleShowRetiro = () => setshowRetiro(true);
  const [showFile, setShowFile] = useState(false);
  const handleCloseFile = () => setShowFile(false);
  const handleShowFile = () => setShowFile(true);
  const [formData, setFormData] = useState({
    status: null,
    detalle: null,
  });

  const paymentStatus = [
    {
      value: "0",
      name: "Pendiente",
    },
    {
      value: "1",
      name: "En proceso",
    },
    {
      value: "2",
      name: "Realizado",
    },
    {
      value: "3",
      name: "Rechazado",
    },
  ];

  const listComisiones = async () => {
    setComisiones([]);
    try {
      setLoading(true);
      const data = {
        search: search,
        paginate: paginate,
      };
      const response = await apiClient.post(`admin/commissions?page=${currentPage}`, data);
      setComisiones(response.data.data);
      setTotalPages(response.data.last_page);
      setPerPage(response.data.per_page);
      setCurrentPageTable(response.data.current_page);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al listar comisiones", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listComisiones();
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

  const editComision = async (id) => {
    handleShowRetiro();
    setRetiroId(null);
    setFormData({
      status: null,
      detalle: null,
    });
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/admin/commissions/show/${id}`);
      setFormData({
        status: response.data.data.status ?? null,
      });
      setRetiroId(response.data.data.id);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al consultar retiro", "error");
    } finally {
      setIsLoading(false);
    }
    // navigate(`/admin/publications/edit/${id}`);
  };

  const consultarUsuario = async (id) => {
    setDataUser(null);
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/admin/user/edit/${id}`);
      const res = response.data.data;
      const data = [
        {
          id: 1,
          numCol: 6,
          label: "Nombre",
          input: res.username + " " + res.surname,
        },
        {
          id: 2,
          numCol: 6,
          label: "DNI",
          input: res.tax_id,
        },
        {
          id: 3,
          numCol: 6,
          label: "Celular",
          input: res.phone,
        },
        {
          id: 4,
          numCol: 6,
          label: "Correo",
          input: res.email,
        },
      ];
      setDataUser(data);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al consultar usuario", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const consultarCuentaBancaria = async (id) => {
    setDataCuentaBancaria(null);
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/admin/commissions/bank-account/${id}`);
      const res = response.data.data;
      const data = [
        {
          id: 1,
          numCol: 6,
          label: "Banco",
          input: res.banco.nom_banco,
        },
        {
          id: 2,
          numCol: 6,
          label: "Titular",
          input: res.titular,
        },
        {
          id: 3,
          numCol: 6,
          label: "Moneda",
          input: res.moneda,
        },
        {
          id: 4,
          numCol: 6,
          label: "Numero de cuenta",
          input: res.numero_cuenta,
        },
        {
          id: 5,
          numCol: 6,
          label: "CCI",
          input: res.cci,
        },
      ];
      setDataCuentaBancaria(data);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al consultar cuenta bancaria", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setDataUser(null);
    setDataCuentaBancaria(null);
  };

  const handleSubmitRetiro = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await apiClient.post(`/admin/commissions/update-status/${retiro_id}`, formData);
      if (response.data.success) {
        setFormData({
          status: null,
          detalle: null,
        });
        showNotification(response.data.message, "success");
        listComisiones();
        handleCloseRetiro();
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar estado", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showModalFile = (id) => {
    handleShowFile();
    setRetiroId(id);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotification("Comprobante de Pago obligatorio", "error");
      return;
    }
    const data = new FormData();
    data.append("comprobante_pago", file);

    try {
      setIsLoading(true);
      const response = await apiClient.post(`/admin/commissions/update-file/${retiro_id}`, data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        handleCloseFile();
        listComisiones();
        setFile(null);
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error?.response?.data?.message || "Error al subir archivo", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-8 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Retirar Comisiones</h5>
          </div>
          <div className="col-12 col-md-2 mb-1">
            <select className="form-select" onChange={handleEntradaChange} value={paginate}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="col-12 col-md-2 mb-1">
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
        <div className="table-responsive pt-2 ps-4 pe-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Comisión</th>
                <th>A Depositar</th>
                <th>Factura</th>
                <th>Cuenta bancaria</th>
                <th>Comprobante de pago</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={`table-border-bottom-0 ${loading ? "position-relative" : ""}`}>
              <LoaderTable loading={loading} cantidad={comisiones.length}></LoaderTable>
              {comisiones.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn rounded-pill btn-sm btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#modalUser"
                      onClick={() => consultarUsuario(item.user_id)}
                    >
                      {item.username}
                    </button>
                  </td>
                  <td>{item.tipo}</td>
                  <td>{item.amount}</td>
                  <td>{item.comision}</td>
                  <td>{item.a_depositar}</td>
                  <td style={{ minWidth: 170 }}>
                    {item.file_comprobante && (
                      <a
                        href={item.file_comprobante}
                        className="btn rounded-pill btn-sm btn-info"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Factura
                      </a>
                    )}
                  </td>
                  <td style={{ minWidth: 160 }}>
                    {item.user_bank_id && (
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#modalCuentaBancaria"
                        onClick={() => consultarCuentaBancaria(item.user_bank_id)}
                      >
                        Ver cuenta
                      </a>
                    )}
                  </td>
                  <td className="text-center">
                    {item.comprobante_pago ? (
                      <a
                        href={item.comprobante_pago}
                        className="btn btn-xs rounded-pill btn-secondary"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Descargar Comprobante"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <i className="bx bxs-cloud-download"></i>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm rounded-pill btn-primary"
                        onClick={() => showModalFile(item.id)}
                      >
                        Adjuntar
                      </button>
                    )}
                  </td>
                  <td>
                    <span className={`badge rounded-pill`} style={{ backgroundColor: item.status.color }}>
                      {item.status.name}
                    </span>
                  </td>
                  <td>{item.observacion}</td>
                  <td>
                    {item.status.id != 3 && (
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
                            onClick={() => editComision(item.id)}
                          >
                            <i className="bx bx-edit-alt me-1"></i> Editar
                          </button>
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

      <div className="modal fade" id="modalUser" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Datos del Usuario</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {dataUser === null ? (
                <p className="text-center">Cargando Datos...</p>
              ) : (
                <div className="row g-2">
                  <ModalInput items={dataUser}></ModalInput>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalCuentaBancaria" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Datos de la Cuenta</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {dataCuentaBancaria === null ? (
                <p className="text-center">Cargando Datos...</p>
              ) : (
                <div className="row g-2">
                  <ModalInput items={dataCuentaBancaria}></ModalInput>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showRetiro} onHide={handleCloseRetiro} centered>
        <Modal.Header closeButton>
          <h5 className="modal-title">Editar Pedido de Retiro</h5>
        </Modal.Header>
        <Modal.Body>
          {formData.status === null ? (
            <p className="text-center">Cargando Datos...</p>
          ) : (
            <form onSubmit={handleSubmitRetiro}>
              <div className="row g-2">
                <div className="col-12 mb-2">
                  <label className="form-label">Estado</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    {paymentStatus.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label">Detalle</label>
                  <textarea
                    name="detalle"
                    className="form-control"
                    value={formData.detalle}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-12 mb-2">
                  <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading && (
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
        </Modal.Body>
      </Modal>

      <Modal show={showFile} onHide={handleCloseFile} centered>
        <Modal.Header closeButton>
          <h5 className="modal-title">Adjuntar Comprobante de Pago</h5>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitFile}>
            <div className="row g-2">
              <div className="col-12 mb-3">
                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <div className="col-12 mb-2">
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading && (
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  Enviar Comprobante
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Tooltip id="my-tooltip" place="top" />
    </>
  );
};
