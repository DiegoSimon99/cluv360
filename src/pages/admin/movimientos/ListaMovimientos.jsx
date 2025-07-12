import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import LoaderTable from "../../../components/admin/LoaderTable";
import { formatDate } from "../../../utils/dateFormatter";

export const ListaMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado de error
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [perPage, setPerPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(10);
  const [currentPageTable, setCurrentPageTable] = useState(1);

  useEffect(() => {
    const fetchMovimientos = async () => {
      setMovimientos([]);
      setLoading(true);
      try {
        const data = {
          search: search,
          paginate: paginate,
        };
        const response = await apiClient.post(`admin/movements?page=${currentPage}`, data);
        setMovimientos(response.data.data);
        setTotalPages(response.data.last_page); // Establecer el total de páginas
        setPerPage(response.data.per_page);
        setCurrentPageTable(response.data.current_page);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovimientos();
  }, [currentPage, search, paginate]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Función para generar las páginas con "..." entre ellas
  const getPagination = () => {
    const pages = [];
    let start = Math.max(currentPage - 2, 1); // Comienza a 2 páginas antes
    let end = Math.min(currentPage + 2, totalPages); // Termina a 2 páginas después

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

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-8 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Lista de Movimientos</h5>
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
                <th>Usuario origen</th>
                <th>Usuario destino</th>
                <th>Concepto</th>
                <th>Moneda</th>
                <th>Monto</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0 position-relative">
              <LoaderTable loading={loading} cantidad={movimientos.length}></LoaderTable>
              {movimientos.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td>{item.usuario_origen ? item.usuario_origen.nombres : "-"}</td>
                  <td>{item.usuario_destino ? item.usuario_destino.nombres : "-"}</td>
                  <td>{item.movimiento_conceptos.nombre}</td>
                  <td>{item.moneda}</td>
                  <td>{item.monto}</td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginación */}
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
    </>
  );
};
