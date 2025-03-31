import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import { showNotification } from "../../../utils/greetingHandler";
import LoaderTable from "../../../components/admin/LoaderTable";
import NumberFormatter from '../../../components/NumberFormatter';
import { Modal } from "react-bootstrap";

export const Index = () => {
    const [ventas, setVentas] = useState([]);
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState(10);
    const [fecha_inicio, setFechaInicio] = useState('');
    const [fecha_fin, setFechaFin] = useState('');

    const [searchCliente, setSearchCliente] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);

    /*Modal ChangeVenta*/
    const [showChangeVenta, setshowChangeVenta] = useState(false);
    const handleCloseChangeVenta = () => setshowChangeVenta(false);
    const handleShowChangeVenta = () => setshowChangeVenta(true);

    const [formData, setFormData] = useState({
        project_id: "",
        currency: "PEN",
        amount: ""
    });

    const handleChangeForm = (e) => {
        const { name, value } = e.target;

        if (name === "amount") {
            const decimalRegex = /^\d*\.?\d*$/;
            if (!decimalRegex.test(value)) {
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const listVentas = () => {
        setVentas([]);
        setLoading(true);
        const data = {
            search: search,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            paginate: paginate
        }
        apiClient.post(`admin/direct-sale?page=${currentPage}`, data)
            .then(response => {
                setVentas(response.data.data);
                setTotalPages(response.data.last_page);
                setPerPage(response.data.per_page);
                setCurrentPageTable(response.data.current_page);
            })
            .catch(error => {
                showNotification(error,'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        listVentas();
    }, [currentPage, search, fecha_inicio, fecha_fin, paginate]);

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

    useEffect(() => {
        apiClient.get(`admin/list_project`)
            .then(response => {
                setProject(response.data.data);
            })
            .catch(error => {
                showNotification(error,'error');
            });
    }, [])

    const handleFilterSubmit = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterKeyup = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
        }
    };

    const handleFilterFechaInicioChange = (e) => {
        setCurrentPage(1);
        setFechaInicio(e.target.value);
    }

    const handleFilterFechaFinChange = (e) => {
        setCurrentPage(1);
        setFechaFin(e.target.value);
    }

    const handleEntradaChange = (e) => {
        setPaginate(e.target.value);
        setCurrentPage(1);
    };

    const handleSubmitVenta = (e) => {
        e.preventDefault();
        if (selectedCliente) {
            if (!formData.project_id || !formData.currency || !formData.amount) {
                showNotification("Por favor, completa todos los campos obligatorios.", "error");
                return;
            }

            const carouselElement = document.getElementById('modalCarouselControls');
            const carousel = new window.bootstrap.Carousel(carouselElement);
            carousel.next();

        } else {
            showNotification("Cliente Incorrecto", 'error');
        }
    }

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        const password = e.target.password.value;

        if (!password) {
            showNotification("Por favor, ingrese su contraseña.", "error");
            return;
        }

        const updatedFormData = {
            ...formData,
            user_id: selectedCliente,
            password: password
        };

        try {
            setLoading(true);
            const response = await apiClient.post(`admin/direct-sale/store`, updatedFormData);
            if (response.data.success) {
                showNotification(response.data.message, 'success');
                setFormData({
                    project_id: "",
                    currency: null,
                    amount: null
                });
                setSelectedCliente(null);
                setSearchCliente(null)
                setLoading(false);
                listVentas();
                handleCloseChangeVenta();
            } else {
                showNotification(response.data.message, 'error');
            }
        } catch (error) {
            showNotification(error.response?.data?.message || "Error al generar venta", 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleSearchChange = async (event) => {
        const value = event.target.value;
        setSearchCliente(value);

        if (value.length > 0) {
            try {
                const data = {
                    keyword: value,
                    type: 1
                }
                const response = await apiClient.post("admin/patrocinador_search", data);
                setOptions(response.data.data);
            } catch (error) {
                showNotification("Error al consultar cliente:", 'error');
            }
        } else {
            setOptions([]);
            setSelectedCliente(null)
        }
    };

    const handleOptionClick = (cliente) => {
        setSelectedCliente(cliente.id);
        setSearchCliente(`${cliente.name}`);
        setOptions([]);
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Ventas directa</h5>
                    </div>
                    <div className="col-12 col-md-2 mb-4">
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => handleShowChangeVenta()}
                        > Nueva Venta
                        </button>
                    </div>
                    <div className="col-12 col-md-2 mb-2">
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
                    <div className="col-12 col-md-2 mb-2">
                        <label>Fecha Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            onChange={handleFilterFechaInicioChange}
                        />
                    </div>
                    <div className="col-12 col-md-2 mb-2">
                        <label>Fecha Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            onChange={handleFilterFechaFinChange}
                        />
                    </div>
                    <div className="col-12 col-md-2 mb-2">
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
                                <th>Fecha</th>
                                <th>Proyecto</th>
                                <th>Cliente</th>
                                <th>Monto Total</th>
                                <th>Estado de Pago</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0 position-relative">
                            <LoaderTable
                                loading={loading}
                                cantidad={ventas.length}
                            ></LoaderTable>
                            {ventas.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>{item.created_at}</td>
                                    <td>{item.project}</td>
                                    <td>{item.client}</td>
                                    <td>
                                        {item.symbol}
                                        <NumberFormatter value={item.amount}></NumberFormatter>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill bg-label-${item.color_status}`}>{item.name_status}</span>
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
                show={showChangeVenta}
                onHide={handleCloseChangeVenta}
                centered
            >
                <Modal.Header closeButton>
                    <h5 className="modal-title">Nueva Venta</h5>
                </Modal.Header>
                <Modal.Body>
                    <div id="modalCarouselControls" className="carousel slide pb-6 mb-2" data-bs-interval="false">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <form onSubmit={handleSubmitVenta}>
                                    <div className="row g-2">
                                        <div className="col-12 mb-2">
                                            <label className="form-label">Proyecto</label>
                                            <select
                                                name="project_id"
                                                className='form-control'
                                                value={formData.project_id}
                                                onChange={handleChangeForm}
                                                required
                                            >
                                                <option value="" selected>SELECCIONAR</option>
                                                {project.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Tipo Moneda</label>
                                            <select
                                                name="currency"
                                                className='form-select'
                                                value={formData.currency}
                                                onChange={handleChangeForm}
                                                required
                                            >
                                                <option value="PEN" selected>S/</option>
                                                <option value="USD">$</option>
                                            </select>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Monto</label>
                                            <input
                                                name="amount"
                                                className='form-control'
                                                value={formData.amount}
                                                onChange={handleChangeForm}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-2">
                                            <label className="form-label">CODIGO DEL CLIENTE QUE RECIBE LA VENTA</label>
                                            <input
                                                type="search"
                                                placeholder="Busca y selecciona por código"
                                                className='form-control'
                                                value={searchCliente}
                                                onChange={handleSearchChange}
                                            />
                                            {options.length > 0 && (
                                                <ul className="list-group mt-2">
                                                    {options.map((option) => (
                                                        <li
                                                            key={option.id}
                                                            className="list-group-item list-group-item-action"
                                                            onClick={() => handleOptionClick(option)}
                                                        >
                                                            {option.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="col-12 mb-2">
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                data-bs-slide="next"
                                            >
                                                Generar Venta
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="carousel-item">
                                <form onSubmit={handleSubmitPassword}>
                                    <div className="col-12 mb-4">
                                        <div className="alert d-flex align-items-start alert-warning mb-0" role="alert">
                                            <span className="alert-icon me-3 rounded-circle"><i className="bx bx-info-circle bx-sm"></i></span>
                                            Por favor, confirma tu contraseña para proceder con la venta. Esta acción es necesaria para validar tu autenticación como usuario autorizado.
                                        </div>
                                    </div>
                                    <div className="col-12 mb-4">
                                        <label className="form-label">INGRESE SU CONTRASEÑA DE USUARIO</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className='form-control'
                                            placeholder="Ingrese su contraseña"
                                            required
                                        />
                                    </div>
                                    <div className="col-12 text-end">
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? (
                                                <div>
                                                    <span className="pe-1">Cargando </span>
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                "Confirmar"
                                            )}
                                        </button>
                                        <a className="btn btn-secondary ms-1" href="#modalCarouselControls" role="button" data-bs-slide="prev">
                                            Atrás
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}