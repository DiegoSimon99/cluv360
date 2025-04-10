import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import LoaderTable from "../../../components/admin/LoaderTable";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";
import { showNotification } from "../../../utils/greetingHandler";
import { Tooltip } from "react-tooltip";

export const Index = () => {
  const [supportTicket, setSupportTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(10);
  const navigate = useNavigate();

  const listSupportTicket = async () => {
    try {
      setSupportTicket([]);
      setLoading(true);
      const data = {
        search: search,
        paginate: paginate,
      };
      const response = await apiClient.post(`admin/support_ticket?page=${currentPage}`, data);
      setSupportTicket(response.data.data);
      setTotalPages(response.data.last_page);
      setPerPage(response.data.per_page);
      setCurrentPageTable(response.data.current_page);
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al listar tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listSupportTicket();
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

  const viewDetails = (id) => {
    navigate(`/admin/support_ticket/details/${id}`);
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Ticket de soporte</h5>
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
                <th>Ticket ID</th>
                <th>Fecha de envío</th>
                <th>Subject</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={`table-border-bottom-0 ${loading ? "position-relative" : ""}`}>
              <LoaderTable loading={loading} cantidad={supportTicket.length}></LoaderTable>
              {supportTicket.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td>{item.code}</td>
                  <td>
                    <div className="d-flex justify-content-between">
                      {formatDate(item.created_at)}
                      {item.viewed == 0 && <span className="badge rounded-pill bg-label-info">Nuevo</span>}
                    </div>
                  </td>
                  <td>{item.subject}</td>
                  <td>{item.username + " " + item.surname}</td>
                  <td>
                    {item.status == "pending" ? (
                      <span className="badge rounded-pill bg-label-danger">{item.status}</span>
                    ) : item.status == "open" ? (
                      <span className="badge rounded-pill bg-label-secondary">{item.status}</span>
                    ) : (
                      <span className="badge rounded-pill bg-label-success">{item.status}</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Ver Detalles"
                      onClick={() => viewDetails(item.id)}
                    >
                      <i className="bx bxs-show"></i>
                    </button>
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
      <Tooltip id="my-tooltip" place="top" />
    </>
  );
};
