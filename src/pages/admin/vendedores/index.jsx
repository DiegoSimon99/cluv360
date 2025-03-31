import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import LoaderTable from "../../../components/admin/LoaderTable";
import { confirmAlert } from "react-confirm-alert";
import { useAdmin } from "../../../layouts/contexts/AdminContext";
import { showNotification } from "../../../utils/greetingHandler";
import ModalInput from "../../../components/admin/ModalInput";
import { Modal } from "react-bootstrap";

export const Index = () => {
  const [sellerId, setSellerId] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [dataUser, setDataUser] = useState(null);
  const [dataSeller, setDataSeller] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(10);
  const { showLoading, hideLoading } = useAdmin();
  const [showSeller, setShowSeller] = useState(false);
  const handleCloseSeller = () => setShowSeller(false);
  const handleShowSeller = () => setShowSeller(true);
  const [formData, setFormData] = useState({
    username: null,
    surname: null,
    commission: null,
    email: null,
    password: null,
  });

  const listSellers = async () => {
    setSellers([]);
    try {
      setLoading(true);
      const data = {
        search: search,
        paginate: paginate,
      };
      const response = await apiClient.post(`admin/sellers?page=${currentPage}`, data);
      setSellers(response.data.data);
      setTotalPages(response.data.last_page);
      setPerPage(response.data.per_page);
      setCurrentPageTable(response.data.current_page);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al listar vendedores", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listSellers();
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

  const editSeller = async (id) => {
    handleShowSeller();
    setDataSeller(null);
    try {
      const response = await apiClient.get(`/admin/sellers/profile/${id}`);
      const res = response.data.data;
      setSellerId(id);
      setFormData({
        username: res.username,
        surname: res.surname,
        commission: res.commission,
        email: res.email,
      });
      setDataSeller(res);
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrio un error al consultar vendedor", "error");
    }
  };

  const deleteSeller = (id) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro que deseas eliminar este vendedor?",
      buttons: [
        {
          label: "Sí, eliminar",
          onClick: async () => {
            try {
              showLoading();
              const response = await apiClient.delete(`/admin/sellers/${id}`);
              if (response.data.success) {
                showNotification(response.data.message, "success");
                listSellers();
              } else {
                showNotification(response.data.message, "error");
              }
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al eliminar vendedor", "error");
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

  const handleCheckboxChange = async (e, id) => {
    const { name } = e.target;
    const newStatus = e.target.checked ? 1 : 0;
    const data = {
      status: newStatus,
    };
    if (name === "verification_status") {
      setSellers((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, verification_status: newStatus } : item))
      );
      try {
        const response = await apiClient.post(`/admin/sellers/update-approved/${id}`, data);
        if (response.data.success) {
          showNotification(response.data.message, "success");
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al actualizar estado", "error");
      }
    }
  };

  const profileSeller = async (id) => {
    setProfile(null);
    setDataUser(null);
    try {
      const response = await apiClient.get(`/admin/sellers/profile/${id}`);
      const res = response.data.data;
      const data = [
        {
          id: 1,
          numCol: 4,
          label: "Dirección",
          input: res.address,
        },
        {
          id: 2,
          numCol: 4,
          label: "Celular",
          input: res.phone,
        },
        {
          id: 3,
          numCol: 4,
          label: "Productos totales",
          input: res.total_products,
        },
        {
          id: 4,
          numCol: 4,
          label: "Órdenes totales",
          input: res.total_orders,
        },
        {
          id: 5,
          numCol: 4,
          label: "Monto total vendido",
          input: res.total_vendido,
        },
        {
          id: 6,
          numCol: 4,
          label: "Saldo de billetera",
          input: res.saldo,
        },
      ];
      setProfile(res);
      setDataUser(data);
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrio un error al consultar perfil", "error");
    }
  };

  const handleCloseModal = () => {
    setDataUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar campo commission
    if (name === "commission") {
      // Permitir solo números y máximo un punto decimal
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (!regex.test(value) && value !== "") return; // si no pasa, no actualices
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitSeller = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await apiClient.patch(`/admin/sellers/${sellerId}`, formData);
      handleCloseSeller();
      showNotification(response.data.message, "success");
      listSellers();
      setFormData({
        username: null,
        surname: null,
        commission: null,
        email: null,
        password: null,
      });
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrio un error al actualizar vendedor", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Vendedores</h5>
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
                <th>% Comisión</th>
                <th>Nombres</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Aprobación</th>
                <th>Núm. de productos</th>
                <th>Debido al vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={`table-border-bottom-0 ${loading ? "position-relative" : ""}`}>
              <LoaderTable loading={loading} cantidad={sellers.length}></LoaderTable>
              {sellers.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td>{item.commission}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="verification_status"
                        checked={item.verification_status === 1}
                        onChange={(e) => handleCheckboxChange(e, item.id)}
                      />
                    </div>
                  </td>
                  <td>{item.products_count}</td>
                  <td>{item.debido_vendedor}</td>
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
                          data-bs-toggle="modal"
                          data-bs-target="#modalUser"
                          onClick={() => profileSeller(item.id)}
                        >
                          <i className="bx bx-user me-1"></i> Perfil
                        </button>
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          href="#"
                          onClick={() => editSeller(item.id)}
                        >
                          <i className="bx bx-edit-alt me-1"></i> Editar
                        </button>
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          onClick={() => deleteSeller(item.id)}
                        >
                          <i className="bx bx-trash me-1"></i> Eliminar
                        </button>
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

      <div className="modal fade" id="modalUser" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Datos del Vendedor</h5>
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
                  <div className="col-12 mb-3">
                    <div className="user-avatar-section">
                      <div className=" d-flex align-items-center flex-column">
                        <img
                          className="img-fluid rounded mb-4"
                          src={profile.avatar_original}
                          height="120"
                          width="120"
                          alt="User avatar"
                        />
                        <div className="user-info text-center">
                          <h5>{profile.username + " " + profile.surname}</h5>
                          <span className="badge bg-label-secondary">{profile.shop_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ModalInput items={dataUser}></ModalInput>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showSeller} onHide={handleCloseSeller} centered>
        <Modal.Header closeButton>
          <h5 className="modal-title">Información del vendedor</h5>
        </Modal.Header>
        <Modal.Body>
          {dataSeller === null ? (
            <p className="text-center">Cargando Datos...</p>
          ) : (
            <form onSubmit={handleSubmitSeller}>
              <div className="row g-2">
                <div className="col-12 mb-3">
                  <label className="form-label">Nombres</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Apellidos</label>
                  <input
                    type="text"
                    className="form-control"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Comisión</label>
                  <input
                    type="text"
                    className="form-control"
                    name="commission"
                    value={formData.commission}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
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
    </>
  );
};
