import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import { showNotification } from "../../../../utils/greetingHandler";
import LoaderTable from "../../../../components/admin/LoaderTable";
import { useNavigate } from 'react-router-dom';
import { useAdmin } from "../../../../layouts/contexts/AdminContext";

export const Index = () => {
    const [cierreCiclo, setCierreCiclo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [paginate, setPaginate] = useState(10);
    const { showLoading, hideLoading } = useAdmin();
    const navigate = useNavigate();

    const listRangos = () => {
        setCierreCiclo([]);
        setLoading(true);
        const data = {
            paginate: paginate
        }
        apiClient.post(`admin/config/cierre-ciclo?page=${currentPage}`, data)
            .then(response => {
                setCierreCiclo(response.data.data);
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
        listRangos();
    }, [currentPage, paginate]);

    const getPagination = () => {
        const pages = [];
        let start = Math.max(currentPage - 2, 1);
        let end = Math.min(currentPage + 2, totalPages);

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

    const handleEntradaChange = (e) => {
        setPaginate(e.target.value);
        setCurrentPage(1);
    };

    const createRango = (e) => {
        navigate('/admin/config/cerrar-ciclo/create');
    }

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Cierre de Ciclo</h5>
                    </div>
                    <div className="col-12 col-md-2 mb-4">
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => createRango()}
                        > Nuevo Cierre
                        </button>
                    </div>
                    <div className="col-12 col-md-2 mb-1">
                        <label>Entradas</label>
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
                </div>
                <div className="table-responsive text-nowrap pt-2 ps-4 pe-4">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>FECHA</th>
                                <th>PREMIAR RANGO</th>
                                <th>ASIGNAR RANGO AL PREMIADO</th>
                                <th>ASIGNAR NIVELES APERTURADOS</th>
                                <th>RESETEAR PUNTOS PERSONALES</th>
                                <th>RESETEAR PUNTOS DE EQUIPO</th>
                                <th>RESETEAR ACUMULADOR DE GANANCIAS</th>
                                <th>PAGAR BONO GLOBAL</th>
                            </tr>
                        </thead>
                        <tbody className={`table-border-bottom-0 ${loading ? 'position-relative' : ''}`}>
                            <LoaderTable
                                loading={loading}
                                cantidad={cierreCiclo.length}
                            ></LoaderTable>
                            {cierreCiclo.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>{item.date}</td>
                                    <td>{item.premio}</td>
                                    <td>{item.rango}</td>
                                    <td>{item.niveles}</td>
                                    <td>{item.pm_activacion}</td>
                                    <td>{item.pm_mes}</td>
                                    <td>{item.comision_mes}</td>
                                    <td>{item.bono_global}</td>
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