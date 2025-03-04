import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import { showNotification } from "../../../utils/greetingHandler";
import LoaderTable from "../../../components/admin/LoaderTable";
import { confirmAlert } from "react-confirm-alert";
import { useLoading } from "../../../layouts/admin/contexts/LoadingContext";
import Swal from "sweetalert2";

export const Index = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState(10);
    const { showLoading, hideLoading } = useLoading();

    const listPosts = () => {
        setLoading(true);
        const data = {
            search: search,
            paginate: paginate
        }
        apiClient.post(`admin/posts?page=${currentPage}`, data)
            .then(response => {
                setPosts(response.data.data);
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
        listPosts();
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

    const handleAlertDescription = (data) => {
        Swal.fire({
            text: data,
            showConfirmButton: false
        });
    };

    const handleAlertContenido = (file, text) => {
        if (file) {
            window.open(file, '_blank');
        } else {
            Swal.fire({
                text: text,
                showConfirmButton: false
            });
        }
    }

    const handleCheckboxChange = (index) => async (e) => {
        const newStatus = e.target.checked ? 1 : 0; // Convertimos a 1 o 0 según el estado del switch
        const postId = posts[index].id;
        const dataPost = {
            post_id: postId,
            status: newStatus
        }
        try {
            setIsLoading(true);
            const response = await apiClient.post('/admin/posts/update_status', dataPost);
            const data = response.data;

            if (data.success) {
                showNotification(data.message, 'success');
                const updatedPosts = [...posts];
                updatedPosts[index].status = newStatus;
                setPosts(updatedPosts);
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            showNotification(error.response?.data?.message || "Error al actualizar el estado", 'error');
        } finally{
            setIsLoading(false);
        }
    };

    const deletePost = (id) => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar esta publicación?',
            buttons: [
                {
                    label: 'Sí, eliminar',
                    onClick: async () => {
                        try {
                            showLoading();
                            const response = await apiClient.delete(`/admin/posts/${id}`);
                            showNotification(response.data.message, 'success');
                            listPosts();
                        } catch (error) {
                            showNotification(error.response?.data?.message || "Error al eliminar la publicación", 'error');
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

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Publicaciones</h5>
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
                                <th>Usuario</th>
                                <th>Tipo de Publicación</th>
                                <th>Contenido</th>
                                <th>Descripción</th>
                                <th>Estado de Publicación</th>
                                <th>Fecha de Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`table-border-bottom-0 ${loading ? 'position-relative' : ''}`}>
                            <LoaderTable
                                loading={loading}
                                cantidad={posts.length}
                            ></LoaderTable>
                            {posts.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{(index + 1) + (currentPageTable - 1) * perPage}</td>
                                    <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{item.username}</td>
                                    <td>{item.type_post}</td>
                                    <td>
                                        <span className="cursor-pointer" onClick={() => handleAlertContenido(item.file, item.text)}>Ver contenido</span>

                                    </td>
                                    <td>
                                        {item.description && (
                                            <span className="cursor-pointer" onClick={() => handleAlertDescription(item.description)}>Ver Descripción</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className='form-check form-switch'>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={item.status}
                                                disabled={isLoading}
                                                onChange={handleCheckboxChange(index)}
                                            />
                                        </div>
                                    </td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <td>
                                            <div className="dropdown">
                                                <button aria-label='Click me' type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <button
                                                        aria-label="dropdown action option"
                                                        className="dropdown-item"
                                                        onClick={() => deletePost(item.id)}
                                                    >
                                                        <i className="bx bx-trash me-1"></i> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
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