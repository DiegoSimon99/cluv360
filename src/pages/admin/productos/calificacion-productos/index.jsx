import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import { showNotification } from "../../../../utils/greetingHandler";
import LoaderTable from "../../../../components/admin/LoaderTable";
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import { useAdmin } from "../../../../layouts/contexts/AdminContext";
import NumberFormatter from "../../../../components/NumberFormatter";

export const Index = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState(10);
    const [types, setTypes] = useState([]);
    const [filterType, setFilterType] = useState('');

    const listProductos = () => {
        setProductos([]);
        setLoading(true);
        const data = {
            search: search,
            paginate: paginate,
            type: filterType
        }
        apiClient.post(`admin/products/reviews/lista?page=${currentPage}`, data)
            .then(response => {
                setProductos(response.data.data);
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
        const dataType = [
            { value: "rating,desc", name: "Calificación (Alta > Baja)" },
            { value: "rating,asc", name: "Calificación (Baja > Alta)" }
        ];
        setTypes(dataType);
    }, [])

    useEffect(() => {
        listProductos();
    }, [currentPage, search, paginate, filterType]);

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

    const handleFilterSubmit = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterKeyup = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
        }
    };

    const handleEntradaChange = (e) => {
        setPaginate(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(1);
    };

    const handleCheckboxChange = async (e, id) => {
        const newStatus = e.target.checked ? 1 : 0;
        const data = {
            id: id,
            status: newStatus
        }

        setProductos((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
        try {
            const response = await apiClient.post('/admin/products/reviews/updatePublishedReview', data);
            if (response.data.success) {
                showNotification(response.data.message, 'success');
            } else {
                showNotification(response.data.message, 'error');
            }
        } catch (error) {
            showNotification(error.response?.data?.message || "Ocurrio un error al actualizar estado", 'error');
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Calificación de productos</h5>
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
                    <div className="col-12 col-md-3 mb-2">
                        <br />
                        <select
                            className="form-select"
                            onChange={handleFilterTypeChange}
                            value={filterType}
                        >
                            <option value="">Filtrar por calificación</option>
                            {types.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-0 col-md-5 mb-1"></div>
                    <div className="col-12 col-md-2 mb-1">
                        <br />
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
                                <th>Producto</th>
                                <th>Añadido por</th>
                                <th>Cliente</th>
                                <th>Calificación</th>
                                <th>Comentario</th>
                                <th>Publicado</th>
                            </tr>
                        </thead>
                        <tbody className={`table-border-bottom-0 ${loading ? 'position-relative' : ''}`}>
                            <LoaderTable
                                loading={loading}
                                cantidad={productos.length}
                            ></LoaderTable>
                            {productos.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>
                                        {item.product.name}
                                        {item.viewed == 0 && (
                                            <span className="ms-2 badge rounded-pill text-bg-success">Nuevo</span>
                                        )}
                                    </td>
                                    <td>{item.product.added_by}</td>
                                    <td>{item.user.name + " (" + item.user.email + ")"}</td>
                                    <td>{item.rating}</td>
                                    <td className="text-truncate"
                                        style={{
                                            minWidth: '400px',
                                            whiteSpace: 'normal',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                        title={item.comment}
                                    >{item.comment}
                                    </td>
                                    <td>
                                        <div className='form-check form-switch'>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="status"
                                                checked={item.status === 1}
                                                onChange={(e) => handleCheckboxChange(e, item.id)}
                                            />
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