import { useEffect, useRef, useState } from "react";
import apiClient from "../../../api/axios";
import { showNotification } from "../../../utils/greetingHandler";
import LoaderTable from "../../../components/admin/LoaderTable";
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import { useAdmin } from "../../../layouts/contexts/AdminContext";
import { Modal } from "react-bootstrap";
import { formatDate } from "../../../utils/dateFormatter";

export const Conceptos = () => {
    const [conceptos, setConceptos] = useState([]);
    const [id, setId] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState(10);
    const [tpye_form, setTypeForm] = useState(1);
    const { showLoading, hideLoading } = useAdmin();

    /*Modal ChangeConcepto*/
    const [showChangeConcepto, setshowChangeConcepto] = useState(false);
    const handleCloseChangeConcepto = () => setshowChangeConcepto(false);
    const handleShowChangeConcepto = () => setshowChangeConcepto(true);

    const [formData, setFormData] = useState({
        nombre: null
    });

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const nombreRef = useRef(null);

    const listConceptos = () => {
        setConceptos([]);
        setLoading(true);
        const data = {
            search: search,
            paginate: paginate
        }
        apiClient.post(`admin/posts/conceptos?page=${currentPage}`, data)
            .then(response => {
                setConceptos(response.data.data);
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
        listConceptos();
    }, [currentPage, search, paginate]);

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

    const createConcepto = (e) => {
        setTypeForm(1);
        handleShowChangeConcepto();
    }

    useEffect(() => {
        if (nombreRef.current && formData.nombre) {
            nombreRef.current.focus();
        }
    }, [formData.nombre]);

    const editConcepto = async (id) => {
        setId(id);
        setTypeForm(2);
        handleShowChangeConcepto();
        try {
            setLoading(true);
            const response = await apiClient.get(`admin/posts/conceptos/${id}`);
            if (response.data.success) {
                setFormData({
                    nombre: response.data.data.nombre
                });
            } else {
                showNotification(response.data.message, 'error');
            }
        } catch (error) {
            showNotification(error.response?.data?.message || "Error al consultar concepto", 'error');
        } finally {
            setLoading(false);
        }
    }

    const deleteConcepto = (id) => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar este concepto?',
            buttons: [
                {
                    label: 'Sí, eliminar',
                    onClick: async () => {
                        try {
                            showLoading();
                            const response = await apiClient.delete(`/admin/posts/conceptos/${id}`);
                            if (response.data.success) {
                                showNotification(response.data.message, 'success');
                                listConceptos();
                            } else {
                                showNotification(response.data.message, 'error');
                            }
                        } catch (error) {
                            showNotification(error.response?.data?.message || "Error al eliminar concepto", 'error');
                        } finally {
                            hideLoading();
                        }
                    }
                },
                {
                    label: 'Cancelar'
                }
            ]
        });
    }

    const handleSubmitConcepto = async (e) => {
        e.preventDefault()
        if (tpye_form == 1) {
            try {
                setIsLoading(true);
                const response = await apiClient.post("admin/posts/conceptos/store", formData);
                if (response.data.success) {
                    handleCloseChangeConcepto();
                    setFormData({
                        nombre: null
                    });
                    showNotification(response.data.message, 'success');
                    listConceptos();
                } else {
                    showNotification(response.data.message, 'error');
                }
            } catch (error) {
                showNotification(error.response?.data?.message || "Error al guardar concepto", 'error');
            } finally {
                setIsLoading(false);
            }
        } else if (tpye_form == 2) {
            try {
                setIsLoading(true);
                const response = await apiClient.patch(`admin/posts/conceptos/${id}`, formData);
                if (response.data.success) {
                    handleCloseChangeConcepto();
                    setFormData({
                        nombre: null
                    });
                    showNotification(response.data.message, 'success');
                    listConceptos();
                } else {
                    showNotification(response.data.message, 'error');
                }
            } catch (error) {
                showNotification(error.response?.data?.message || "Error al actualizar concepto", 'error');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Conceptos Denuncias</h5>
                    </div>
                    <div className="col-12 col-md-2 mb-4">
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => createConcepto()}
                        > Nuevo Concepto
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
                    <div className="col-0 col-md-8 mb-1"></div>
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
                                <th>Nombre</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`table-border-bottom-0 ${loading ? 'position-relative' : ''}`}>
                            <LoaderTable
                                loading={loading}
                                cantidad={conceptos.length}
                            ></LoaderTable>
                            {conceptos.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>{item.nombre}</td>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>
                                        <div className="dropdown">
                                            <button aria-label='Click me' type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <button
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => editConcepto(item.id)}
                                                >
                                                    <i className="bx bx-edit-alt me-1"></i> Editar
                                                </button>
                                                <button
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    onClick={() => deleteConcepto(item.id)}
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

            <Modal
                show={showChangeConcepto}
                onHide={handleCloseChangeConcepto}
                centered
            >
                <Modal.Header closeButton>
                    <h5 className="modal-title">Nuevo Concepto</h5>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <p className='text-center'>Cargando Datos...</p>
                    ) : (
                        <form onSubmit={handleSubmitConcepto}>
                            <div className="row g-2">
                                <div className="col-12 mb-2">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className='form-control'
                                        ref={nombreRef}
                                        value={formData.nombre}
                                        onChange={handleChangeForm}
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        data-bs-slide="next"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div>
                                                <span className="pe-1">Cargando </span>
                                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            "Guardar"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}