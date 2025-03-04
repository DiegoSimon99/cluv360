import { useEffect, useState } from 'react';
import apiClient from '../../../api/axios';
import { showNotification } from '../../../utils/greetingHandler';
import LoaderTable from '../../../components/admin/LoaderTable';
import NumberFormatter from '../../../components/NumberFormatter';
import { confirmAlert } from 'react-confirm-alert';
import FormattedDate from '../../../components/FormattedDate';

export const Index = () => {
    const [cierres, setCierres] = useState([]);
    const [datos, setDatos] = useState([]);
    const [loadingForm, setLoadingForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);

    const [formData, setFormData] = useState({
        venta: "",
        gasto: "",
        ganancia: "",
        repartir: "",
        individual: "",
        ncuentas: "",
        ciclo: ""
    });

    const listCierrePremium = () => {
        setLoading(true);
        apiClient.get(`admin/cierre-premium?page=${currentPage}`)
            .then(response => {
                setCierres(response.data.data.data);
                setDatos(response.data.datos);
                setTotalPages(response.data.data.last_page);
                setPerPage(response.data.data.per_page);
                setCurrentPageTable(response.data.data.current_page);
                setFormData({
                    venta: response.data.datos.ventas,
                    gasto: response.data.datos.gasto,
                    ganancia: response.data.datos.ganancia,
                    repartir: response.data.datos.aRepartir,
                    individual: response.data.datos.individual,
                    ncuentas: response.data.datos.cuentas_activas,
                    ciclo: response.data.datos.ciclo
                });
            })
            .catch(error => {
                showNotification(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        listCierrePremium();
    }, [currentPage]);

    const handleChangeCierrePremium = (e) => {
        const { name, value } = e.target;

        // Validar que sea un número válido
        if (/^\d*\.?\d*$/.test(value)) {
            // Actualizar solo el campo que se está editando
            setFormData((prev) => {
                const updatedFormData = {
                    ...prev,
                    [name]: value,
                };

                // Realizar cálculos con los valores actualizados
                const venta = parseFloat(updatedFormData.venta || 0);
                const gasto = parseFloat(updatedFormData.gasto || 0);
                const nGanancia = parseFloat((venta - gasto).toFixed(2));
                const nReparte = parseFloat((nGanancia * 0.2).toFixed(2));
                const nIndividual = updatedFormData.ncuentas
                    ? parseFloat((nReparte / parseFloat(updatedFormData.ncuentas)).toFixed(2))
                    : 0;

                // Actualizar los valores calculados
                return {
                    ...updatedFormData,
                    ganancia: nGanancia,
                    repartir: nReparte,
                    individual: nIndividual,
                };
            });
        }
    };

    const handleSubmitCierrePremium = (e) => {
        e.preventDefault();
        confirmAlert({
            title: (
                <>
                    Cerrar ciclo <FormattedDate date={datos.ciclo} />
                </>
            ),
            message: '¿Estás seguro de que deseas cerrar el ciclo?',
            buttons: [
                {
                    label: 'Sí, cerrar ciclo',
                    onClick: () => {
                        setLoadingForm(true);
                        apiClient.post(`/admin/cierre-premium`, formData)
                            .then(response => {
                                if (response.data.success) {
                                    showNotification(response.data.message, 'success');
                                    listCierrePremium();
                                } else {
                                    showNotification(response.data.message, 'error');
                                }
                            })
                            .catch(() => {
                                showNotification("Error al cerrar ciclo", 'error');
                            })
                            .finally(() => {
                                setLoadingForm(false);
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
    return (
        <>
            <div className="card position-relative">
                <LoaderTable
                    loading={loading}
                    cantidad={cierres.length}
                ></LoaderTable>
                <h5 className="card-header">
                    Datos para el cierre del ciclo <FormattedDate date={datos.ciclo} />
                </h5>
                <div className='card-widget-separator-wrapper'>
                    <div className="card-body card-widget-separator">
                        <div className="row gy-4 gy-sm-1">
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center card-widget-1 border-end pb-4 pb-sm-0">
                                    <div>
                                        <h4 className="mb-0">
                                            S/<NumberFormatter value={datos.ventas}></NumberFormatter>
                                        </h4>
                                        <p className="mb-0">Venta</p>
                                    </div>
                                    <div className="avatar me-sm-6">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bx-dollar bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                                <hr className="d-none d-sm-block d-lg-none me-6" />
                            </div>
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center card-widget-2 border-end pb-4 pb-sm-0">
                                    <div>
                                        <h4 className="mb-0">
                                            S/<NumberFormatter value={datos.gasto}></NumberFormatter>
                                        </h4>
                                        <p className="mb-0">Gasto</p>
                                    </div>
                                    <div className="avatar me-lg-6">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bx-file bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                                <hr className="d-none d-sm-block d-lg-none" />
                            </div>
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center border-end pb-4 pb-sm-0 card-widget-3">
                                    <div>
                                        <h4 className="mb-0">
                                            S/<NumberFormatter value={datos.ganancia}></NumberFormatter>
                                        </h4>
                                        <p className="mb-0">Ganancia</p>
                                    </div>
                                    <div className="avatar me-sm-6">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bx-check-double bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="mb-0">
                                            S/<NumberFormatter value={datos.aRepartir}></NumberFormatter>
                                        </h4>
                                        <p className="mb-0">20%</p>
                                    </div>
                                    <div className="avatar">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bx-error-circle bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center card-widget-1 border-end pb-4 pb-sm-0">
                                    <div>
                                        <h4 className="mb-0">{datos.nInversores}</h4>
                                        <p className="mb-0">N cuentas premium</p>
                                    </div>
                                    <div className="avatar me-sm-6">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bxs-user-account bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                                <hr className="d-none d-sm-block d-lg-none me-6" />
                            </div>
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center card-widget-2 border-end pb-4 pb-sm-0">
                                    <div>
                                        <h4 className="mb-0">{datos.cuentas_activas}</h4>
                                        <p className="mb-0">N cuentas activas</p>
                                    </div>
                                    <div className="avatar me-lg-6">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bxs-user-account bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                                <hr className="d-none d-sm-block d-lg-none" />
                            </div>
                            <div className="col-sm-6 col-lg-3 mb-4">
                                <div className="d-flex justify-content-between align-items-center border-end pb-4 pb-sm-0 card-widget-3">
                                    <div>
                                        <h4 className="mb-0">
                                            S/<NumberFormatter value={datos.individual}></NumberFormatter>
                                        </h4>
                                        <p className="mb-0">Individual</p>
                                    </div>
                                    <div className="avatar me-sm-6">
                                        <span className="avatar-initial rounded bg-label-secondary text-heading">
                                            <i className="bx bx-dollar bx-26px"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitCierrePremium}>
                        <div className="row">
                            <div className="col-12 col-lg-2 mb-3">
                                <label htmlFor="Venta">Venta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="venta"
                                    value={formData.venta}
                                    onChange={handleChangeCierrePremium}
                                    required
                                />
                            </div>
                            <div className="col-12 col-lg-2 mb-3">
                                <label htmlFor="Gasto">Gasto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="gasto"
                                    value={formData.gasto}
                                    onChange={handleChangeCierrePremium}
                                    required />
                            </div>
                            <div className="col-12 col-lg-2 mb-3">
                                <label htmlFor="Ganancia">Ganancia</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ganancia"
                                    value={formData.ganancia}
                                    required
                                    readOnly />
                            </div>
                            <div className="col-12 col-lg-2 mb-3">
                                <label htmlFor="20%">20%</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="repartir"
                                    value={formData.repartir}
                                    required
                                    readOnly />
                            </div>
                            <div className="col-12 col-lg-2 mb-3">
                                <label htmlFor="Individual">Individual</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="individual"
                                    value={formData.individual}
                                    required
                                    readOnly />
                            </div>
                            <div className="col-12 col-lg-2 mb-3">
                                <br className="d-none d-md-block" />
                                <button type="submit" className="btn btn-primary w-100" disabled={loadingForm}>
                                    {loadingForm ? (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Cerrar Ciclo"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="card mt-3">
                <h5 className="card-header">Lista de cierres</h5>
                <div className="table-responsive text-nowrap pt-2 ps-4 pe-4">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ciclo</th>
                                <th>Venta</th>
                                <th>Gasto</th>
                                <th>Ganancia</th>
                                <th>20%</th>
                                <th>Individual</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0 position-relative">
                            <LoaderTable
                                loading={loading}
                                cantidad={cierres.length}
                            ></LoaderTable>
                            {cierres.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>{item.mes_cierre + "-" + item.anio_cierre}</td>
                                    <td>
                                        S/<NumberFormatter value={item.imp_venta}></NumberFormatter>
                                    </td>
                                    <td>
                                        S/<NumberFormatter value={item.imp_gasto}></NumberFormatter>
                                    </td>
                                    <td>
                                        S/<NumberFormatter value={item.imp_ganancia}></NumberFormatter>
                                    </td>
                                    <td>
                                        S/<NumberFormatter value={item.imp_repartir}></NumberFormatter>

                                    </td>
                                    <td>
                                        S/<NumberFormatter value={item.imp_individual}></NumberFormatter>
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
};