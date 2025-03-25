import { useEffect, useState } from 'react';
import apiClient from '../../../api/axios';
import { showNotification } from '../../../utils/greetingHandler';
import ModalInput from '../../../components/admin/ModalInput';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useAdmin } from '../../../layouts/contexts/AdminContext';
import Swal from 'sweetalert2'
import Modal from 'react-bootstrap/Modal';
import LoaderTable from '../../../components/admin/LoaderTable';

export const ListaCustomers = () => {
    const [customers, setData] = useState([]);  // Almacena los datos de los usuario
    const [tokens, setTokens] = useState([]);  // Almacena los datos de los usuario
    const [loading, setLoading] = useState(false);  // Estado de carga
    const [loadingUser, setLoadingUser] = useState(false);  // Estado de carga
    const [error, setError] = useState(null);  // Estado de error
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalPages, setTotalPages] = useState(1);  // Total de páginas
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [filterName, setFilterName] = useState('');
    const [filterDate, setFilterDate] = useState(''); // Filtro por fecha
    const [filterPackage, setFilterPackage] = useState(''); // Filtro por paquete
    const [packages, setPackages] = useState([]); // Lista de paquetes
    const [saldo, setSaldo] = useState(null); // Saldo del cliente
    const [user, setUser] = useState(null);
    const [patrocinador, setPatrocinador] = useState(null);
    const [userId, setUserId] = useState(null);
    const { showLoading, hideLoading } = useAdmin();

    const [searchPatrocinador, setSearchPatrocinador] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedPatrocinador, setSelectedPatrocinador] = useState(null);
    /*Modal ResetPassword*/
    const [showResetPassword, setshowResetPassword] = useState(false);
    const handleCloseResetPassword = () => setshowResetPassword(false);
    const handleShowResetPassword = () => setshowResetPassword(true);
    /*Modal ChangePatrocinador*/
    const [showChangePatrocinador, setshowChangePatrocinador] = useState(false);
    const handleCloseChangePatrocinador = () => setshowChangePatrocinador(false);
    const handleShowChangePatrocinador = () => setshowChangePatrocinador(true);

    const [formData, setFormData] = useState({
        username: "",
        surname: "",
        email: "",
        phone: "",
    });

    let [notificar, setNotificar] = useState(0);

    const [formDataPassword, setFormDataPassword] = useState({
        password: ""
    });

    const [formDataPatrocinador, setFormDataPatrocinador] = useState({
        type_patrocinador: "",
        observacion: null
    });

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangePassword = (e) => {
        const { name, value } = e.target;
        setFormDataPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangePatrocinador = (e) => {
        const { name, value } = e.target;
        setFormDataPatrocinador((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        setNotificar(e.target.checked ? 1 : 0);
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();
        const data = {
            password: formDataPassword.password,
            notificar: notificar
        }
        updatePassword(data)
    }

    const handlePasswordStatic = (e) => {
        e.preventDefault();
        const data = {
            password: "12345678",
            notificar: notificar
        }
        updatePassword(data)
    }

    const updatePassword = async (data) => {
        try {
            showLoading();
            const response = await apiClient.patch(`admin/user/password/${userId}`, data);
            if (response.data.success) {
                showNotification(response.data.message, 'success');
                handleCloseResetPassword();
            } else {
                showNotification(response.data.message, 'error');
            }
        } catch (error) {
            console.error("Error al actualizar clave:", error);
            showNotification(error.response?.data?.message || "Error al actualizar clave", 'error');
        } finally {
            hideLoading();
            setFormDataPassword({ password: "" });
            setNotificar(0);
        }
    }

    const handleTokenSms = async (id) => {
        try {
            setLoading(true)
            const response = await apiClient.get(`admin/user/token/${id}`);
            if (response.data.success) {
                setTokens(response.data.data);
            } else {
                showNotification(response.data.success, 'error');
            }
        } catch (error) {
            console.error("Error al consultar token:", error);
            showNotification("Error al consultar token", 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleTokenSesion = (id) => {
        let title = "No hay token";
        if (id) {
            title = id;
        }
        Swal.fire({
            title: title,
            icon: "info",
            draggable: true
        });
    }

    const handleDeleteUser = (id) => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar este usuario?',
            buttons: [
                {
                    label: 'Sí, eliminar',
                    onClick: async () => {
                        try {
                            showLoading();
                            const response = await apiClient.delete(`/admin/user/${id}`);
                            showNotification(response.data.message, 'success');
                            fetchUsers();
                        } catch (error) {
                            console.error("Error al eliminar usuario:", error);
                            showNotification("Error al eliminar usuario", 'error');
                        } finally {
                            hideLoading();
                        }
                    }
                },
                {
                    label: 'Cancelar',
                    onClick: () => console.log('Eliminación cancelada')
                }
            ]
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingUser(true);
        try {
            const response = await apiClient.patch(`/admin/user/update/${userId}`, formData);
            if (response.data.success) {
                showNotification(response.data.message, 'success');
                fetchUsers();
            } else {
                showNotification(response.data.message, 'error');
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            showNotification('Error al actualizar usuario', 'error');
        } finally {
            setLoadingUser(false);
        }
    }

    const editUserId = async (id) => {
        setUserId(id);
        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/user/edit/${id}`);
            if (response.data.success) {
                const { username, surname, email, phone } = response.data.data;
                // Setear valores en el estado
                setFormData({
                    username,
                    surname,
                    email,
                    phone,
                });
            } else {
                showNotification(response.data.message, 'error');
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            showNotification("Error al obtener los datos del usuario", 'error');
        } finally {
            setLoading(false);
        }
    };

    // Cargar lista de paquetes al montar el componente
    useEffect(() => {
        apiClient.get('admin/customer_package')
            .then(response => {
                setPackages(response.data.data); // Guardar los paquetes en el estado
            })
            .catch(error => {
                showNotification("Error al cargar paquetes", "error");
            });
    }, []);

    const handleVerSaldo = async (customerId) => {
        try {
            const response = await apiClient.get(`admin/filter_balance/${customerId}`);
            const res = response.data.data;
            const data = [
                {
                    id: 1,
                    numCol: 6,
                    label: res.balance.name,
                    input: res.balance.amount
                },
                {
                    id: 2,
                    numCol: 6,
                    label: 'USD',
                    input: res.balance_usd.amount
                }
            ]
            setSaldo(data)
        } catch (error) {
            console.error("Error al obtener el saldo:", error);
            showNotification("Error al obtener el saldo", 'error');
        }
    };

    const handleVerUsuario = async (customerId) => {
        try {
            const response = await apiClient.get(`admin/filter_balance/${customerId}`);
            const res = response.data.data;
            const data = [
                {
                    id: 1,
                    numCol: 6,
                    label: 'Nombres',
                    input: res.username
                },
                {
                    id: 2,
                    numCol: 6,
                    label: '% de usuario',
                    input: res.user_comision
                },
                {
                    id: 3,
                    numCol: 6,
                    label: 'Nombre de Negocio',
                    input: res.name_shop
                },
                {
                    id: 4,
                    numCol: 6,
                    label: '% de Negocio',
                    input: res.shop_comision
                }
            ]
            setUser(data)
        } catch (error) {
            console.error("Error al obtener la información del usuario:", error);
            showNotification("Error al obtener la información del usuario", 'error');
        }
    };

    const handleVerPatrocinador = async (customerId) => {
        try {
            const response = await apiClient.get(`admin/patrocinador/${customerId}`);
            const res = response.data.data;
            const data = [
                {
                    id: 1,
                    numCol: 12,
                    label: 'Nombres',
                    input: res.username
                },
                {
                    id: 2,
                    numCol: 6,
                    label: 'Celular',
                    input: res.phone
                },
                {
                    id: 3,
                    numCol: 6,
                    label: 'Rango',
                    input: res.rango
                }
            ]
            setPatrocinador(data)
        } catch (error) {
            console.error("Error al obtener la información del patrocinador:", error);
            showNotification("Error al obtener la información del patrocinador", 'error');
        }
    };

    // Manejar el cierre del modal
    const handleCloseModal = () => {
        setSaldo(null);
        setUser(null);
        setPatrocinador(null);
        setLoading(false);
    };

    // Llamar a la API cuando cambie la página o los filtros
    const fetchUsers = () => {
        let data = {
            page: currentPage,
            search: filterName.trim() || null,
            fecha: filterDate || null,
            tipo_paquete: filterPackage || null
        }
        setLoading(true);
        apiClient.post(`admin/customers_list`, data)
            .then(response => {
                setData(response.data.data);  // Almacenar los datos obtenidos
                setTotalPages(response.data.last_page);  // Establecer el total de páginas
                setPerPage(response.data.per_page);
                setCurrentPageTable(response.data.current_page);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchUsers();
    }, [currentPage, filterName, filterDate, filterPackage]);  // Esto se ejecutará cada vez que cambie `currentPage`

    // Manejar cambio en el filtro de nombre (actualización inmediata)
    const handleFilterNameSubmit = (e) => {
        setFilterName(e.target.value); // Actualizar el filtro de nombre
        setCurrentPage(1); // Reiniciar a la primera página
    };

    const handleFilterNameKeyup = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1); // Reinicia la página al presionar Enter
        }
    };

    // Manejar cambio en el filtro de fecha
    const handleFilterDateChange = (e) => {
        setCurrentPage(1); // Reiniciar a la primera página
        setFilterDate(e.target.value); // Establecer el filtro de fecha
    };

    // Manejar cambio en el filtro de paquete
    const handleFilterPackageChange = (e) => {
        setFilterPackage(e.target.value); // Establecer el filtro de paquete
        setCurrentPage(1); // Reiniciar a la primera página
    };

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

    const handleInputChange = async (event) => {
        const value = event.target.value;
        setSearchPatrocinador(value);

        if (value.length > 0) {
            try {
                const data = {
                    keyword: value,
                    type: 1,
                    userId: userId
                }
                const response = await apiClient.post("admin/patrocinador_search", data);
                setOptions(response.data.data);
            } catch (error) {
                showNotification("Error al consultar patrocinador:", 'error');
            }
        } else {
            setOptions([]);
        }
    };

    const handleOptionClick = (patrocinador) => {
        setSelectedPatrocinador(patrocinador.id);
        setSearchPatrocinador(`${patrocinador.name}`);
        setOptions([]);
    };

    const handleSubmitPatrocinador = async (e) => {
        e.preventDefault();
        if (selectedPatrocinador) {
            const updatedFormData = {
                ...formDataPatrocinador,
                id_patrocinador: selectedPatrocinador
            };
            try {
                setLoading(true);
                const response = await apiClient.post(`admin/user/update_patrocinador/${userId}`, updatedFormData);
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    setFormDataPatrocinador({
                        type_patrocinador: "",
                        observacion: null,
                    });
                    setSelectedPatrocinador(null);
                    setUserId(null);
                    setSearchPatrocinador(null);
                    fetchUsers();
                    handleCloseChangePatrocinador();
                }
            } catch (error) {
                showNotification(error.response?.data?.message || "Error al actualizar patrocinador", 'error');
            } finally {
                setLoading(false);
            }
        } else {
            showNotification("Nuevo Patrocinador Incorrecto", 'error');
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-4 pt-0 pt-md-2 mb-3">
                        <h5 className="mb-0 text-md-start text-center">Lista de Asociados</h5>
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                        <select
                            className="form-select"
                            onChange={handleFilterPackageChange}
                            value={filterPackage}
                        >
                            <option value="">TODOS LOS PAQUETES</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                        <input
                            type="month"
                            className="form-control"
                            onChange={handleFilterDateChange}
                        />
                    </div>
                    <div className="col-12 col-md-2 mb-2">
                        <div className="input-group input-group-merge">
                            <span className="input-group-text" id="basic-addon-search31"><i className="bx bx-search"></i></span>
                            <input
                                type="search"
                                placeholder="Buscar.."
                                className="form-control"
                                value={filterName} // Vincula el valor al estado `filterName`
                                onChange={handleFilterNameSubmit}
                                onKeyUp={handleFilterNameKeyup}
                            />
                        </div>
                    </div>
                </div>
                <div className="table-responsive text-nowrap pt-2 ps-4 pe-4">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Usuario</th>
                                <th>Nombre</th>
                                <th>Saldo</th>
                                <th>Paquete</th>
                                <th>F. Inicio</th>
                                <th>Patrocinador</th>
                                <th>Plataforma</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`table-border-bottom-0 ${loading ? 'position-relative' : ''}`}>
                            <LoaderTable
                                loading={loading}
                                cantidad={customers.length}
                            ></LoaderTable>
                            {customers.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td>{item.usuario}</td>
                                    <td style={{whiteSpace: "normal",wordWrap: "break-word"}}>
                                        <button
                                            type="button"
                                            className='btn btn-link'
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalUser"
                                            onClick={() => handleVerUsuario(item.user_id)}
                                        >
                                            {item.nombre}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalSaldo"
                                            onClick={() => handleVerSaldo(item.user_id)}
                                        >
                                            Ver saldo
                                        </button>
                                    </td>
                                    <td>{item.package_name}</td>
                                    <td>{item.fecha_inicio}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className='btn btn-link'
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalPatrocinador"
                                            onClick={() => handleVerPatrocinador(item.user_id)}
                                        >
                                            {item.patrocinio}
                                        </button>
                                    </td>
                                    <td>{item.plataforma}</td>
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
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasEnd"
                                                    aria-controls="offcanvasEnd"
                                                    onClick={() => editUserId(item.user_id)}
                                                >
                                                    <i className="bx bx-edit-alt me-1"></i> Editar
                                                </a>
                                                <a
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => handleDeleteUser(item.user_id)}
                                                >
                                                    <i className="bx bx-trash me-1"></i> Eliminar
                                                </a>
                                                <a
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => [setUserId(item.user_id), handleShowResetPassword()]}
                                                >
                                                    <i className="bx bx-lock-alt me-1"></i> Resetear Clave
                                                </a>
                                                <a
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalTokens"
                                                    onClick={() => handleTokenSms(item.user_id)}
                                                >
                                                    <i className="bx bx-key me-1"></i> Ver token SMS
                                                </a>
                                                <a
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => handleTokenSesion(item.verification_code)}
                                                >
                                                    <i className="bx bx-key me-1"></i> Ver token Sesión
                                                </a>
                                                <a
                                                    aria-label="dropdown action option"
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => [setUserId(item.user_id), handleShowChangePatrocinador()]}
                                                >
                                                    <i className="bx bx-user me-1"></i> Cambiar Patrocinador
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Paginación */}
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
            <div className="modal fade" id="modalSaldo" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Saldo del Usuario</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleCloseModal}
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            {saldo === null ? (
                                <p className='text-center'>Cargando saldo...</p>
                            ) : (
                                <div className="row g-2">
                                    <ModalInput
                                        items={saldo}
                                    >
                                    </ModalInput>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >

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
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            {user === null ? (
                                <p className='text-center'>Cargando Datos...</p>
                            ) : (
                                <div className="row g-2">
                                    <ModalInput
                                        items={user}
                                    >
                                    </ModalInput>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >

            <div className="modal fade" id="modalPatrocinador" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Datos del Patrocinador</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleCloseModal}
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            {patrocinador === null ? (
                                <p className='text-center'>Cargando Datos...</p>
                            ) : (
                                <div className="row g-2">
                                    <ModalInput
                                        items={patrocinador}
                                    >
                                    </ModalInput>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasEnd" aria-labelledby="offcanvasEndLabel">
                <div className="offcanvas-header">
                    <h5 id="offcanvasEndLabel" className="offcanvas-title">Editar Asociado</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body mt-4 flex-grow-0">
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label>Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label>Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label>Correo</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label>Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <button type="submit" className="btn btn-primary mb-2 w-100" disabled={loadingUser}>
                                        {loadingUser ? (
                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            "Guardar"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <Modal
                show={showResetPassword}
                onHide={handleCloseResetPassword}
                centered
            >
                <Modal.Header closeButton>
                    <h5 className="modal-title">Resetear Clave</h5>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmitPassword}>
                        <div className="row g-2">
                            <div className="col-12 col-md-6 mb-2">
                                <label className="form-label">Clave</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formDataPassword.password}
                                    onChange={handleChangePassword}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6 mb-2">
                                <label className="form-label">Clave Personalizada</label>
                                <button
                                    type="button"
                                    className="btn btn-secondary d-block w-100"
                                    onClick={handlePasswordStatic}
                                >
                                    12345678
                                </button>
                            </div>
                            <div className="col-12 col-md-12 mb-2">
                                <label className="form-label">Notificar Usuario</label>
                                <div className='form-check form-switch'>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={notificar}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-12 mb-2">
                                <button type='submit' className='btn btn-primary w-100'>Enviar</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <div className="modal fade" id="modalTokens" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Transferencias - Token SMS</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleCloseModal}
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-2">
                                <div className="col-12 mb-2">
                                    {loading ? (
                                        <p className='text-center'>Cargando token...</p>
                                    ) : (
                                        <div className="table-responsive text-nowrap">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Usuario destino</th>
                                                        <th>Celular</th>
                                                        <th>Moneda</th>
                                                        <th>Monto</th>
                                                        <th>Codigo</th>
                                                        <th>Fecha de registro</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-border-bottom-0">
                                                    {tokens.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                {index + 1}
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>{item.phone}</td>
                                                            <td>{item.moneda}</td>
                                                            <td>{item.monto}</td>
                                                            <td>{item.code}</td>
                                                            <td>{item.fecha}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <Modal
                show={showChangePatrocinador}
                onHide={handleCloseChangePatrocinador}
                centered
            >
                <Modal.Header closeButton>
                    <h5 className="modal-title">Cambiar patrocinador</h5>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmitPatrocinador}>
                        <div className="row g-2">
                            <div className="col-12 col-md-12 mb-2">
                                <label className="form-label">Patrocinar</label>
                                <select
                                    name="type_patrocinador"
                                    className='form-control'
                                    value={formDataPatrocinador.type_patrocinador}
                                    onChange={handleChangePatrocinador}
                                    required
                                >
                                    <option value="" selected>SELECCIONAR</option>
                                    <option value="1">MOVER AL USUARIO CON SU EQUIPO</option>
                                    <option value="2">MOVER SOLO AL USUARIO</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-12 mb-2">
                                <label className="form-label">Nuevo patrocinador</label>
                                <input
                                    type="search"
                                    placeholder="Busca y selecciona por código"
                                    className='form-control'
                                    value={searchPatrocinador}
                                    onInput={handleInputChange}
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
                            <div className="col-12 col-md-12 mb-2">
                                <label className="form-label">Observaciones</label>
                                <textarea name="observacion"
                                    value={formDataPatrocinador.observacion}
                                    className="form-control"
                                    onChange={handleChangePatrocinador}
                                ></textarea>
                            </div>
                            <div className="col-12 col-md-12 mb-2">
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Enviar"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};
