import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import { showNotification } from "../../../utils/greetingHandler";
import LoaderTable from "../../../components/admin/LoaderTable";
import { confirmAlert } from "react-confirm-alert";
import { useLoading } from "../../../layouts/admin/contexts/LoadingContext";

export const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [search, setSearch] = useState('');
    const { showLoading, hideLoading } = useLoading();
    const [paginate, setPaginate] = useState(10);

    const listSolicitudes = () => {
        setLoading(true);
        apiClient.post(`admin/user/delete_request?page=${currentPage}`, { search: search, paginate: paginate })
            .then(response => {
                setSolicitudes(response.data.data);
                setTotalPages(response.data.last_page);
                setPerPage(response.data.per_page);
                setCurrentPageTable(response.data.current_page);
            })
            .catch(error => {
                showNotification(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        listSolicitudes();
    }, [currentPage, search, paginate]);

    const getPagination = () => {
        const pages = [];
        let start = Math.max(currentPage - 2, 1); // Comienza a 2 páginas antes
        let end = Math.min(currentPage + 2, totalPages); // Termina a 2 páginas después

        // Aseguramos que haya solo 4 botones más el "..."
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
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
        if (e.key === 'Enter') {
            setCurrentPage(1);
        }
    };

    const handleCancelRequest = (id) => {
        confirmAlert({
            title: 'Cancelar Solicitud',
            message: '¿Estás seguro de cancelar esta solicitud?',
            buttons: [
                {
                    label: 'Sí, cancelar solicitud',
                    onClick: () => {
                        showLoading();
                        apiClient.get(`/admin/user/cancel_request/${id}`)
                            .then(response => {
                                if (response.data.success) {
                                    showNotification(response.data.message, 'success');
                                    listSolicitudes();
                                } else {
                                    showNotification(response.data.message, 'error');
                                }
                            })
                            .catch(() => {
                                showNotification("Error al cancelar solicitud", 'error');
                            })
                            .finally(() => {
                                hideLoading();
                            });
                    }
                },
                {
                    label: 'Cancelar',
                    onClick: () => console.log('Envio cancelado')
                }
            ]
        });
    }

    const handleEntradaChange = (e) => {
        setPaginate(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="card">
                <div className="card-header row align-items-center">
                    <div className="col-12 col-md-8 pt-0 pt-md-2 mb-3">
                        <h5 className="mb-0 text-md-start text-center">Solicitudes de eliminación de Asociados</h5>
                    </div>
                    <div className="col-12 col-md-2 mb-2">
                        <select
                            className="form-select"
                            onChange={handleEntradaChange}
                            value={paginate}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-2 mb-2">
                        <div className="input-group input-group-merge">
                            <span className="input-group-text" id="basic-addon-search31"><i className="bx bx-search"></i></span>
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
                                <th>Código</th>
                                <th>Nombres</th>
                                <th>Fecha Eliminación</th>
                                <th>Días restantes</th>
                                <th>Fecha de solicitud</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`table-border-bottom-0 ${loading ? 'position-relative' : ''}`}>
                            <LoaderTable
                                loading={loading}
                                cantidad={solicitudes.length}
                            ></LoaderTable>
                            {solicitudes.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.nombres}</td>
                                    <td>{item.fecha_futura}</td>
                                    <td>{item.dias_restantes}</td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <div className="dropdown">
                                            <button aria-label='Click me' type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <a
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => handleCancelRequest(item.id)}
                                                >
                                                    <i className="bx bx-block me-1"></i> Cancelar Solicitud
                                                </a>
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
                                <a
                                    aria-label="pagination link"
                                    className="page-link"
                                    href="#"
                                    onClick={() => handlePageChange(1)}
                                >
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
                                page === '...' ? (
                                    <li key={index} className="page-item">
                                        <span className="page-link">...</span>
                                    </li>
                                ) : (
                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                                    >
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
}