import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'jstree';
import 'jstree/dist/themes/default/style.css';
import apiClient from '../../../api/axios';
import { showNotification } from '../../../utils/greetingHandler';
import './TreeStyle.css';
import { Modal } from 'react-bootstrap';

export const Index = () => {
    const [legend, setLegend] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const treeRef = useRef(null);
    const user_data = JSON.parse(localStorage.getItem("user_data"));

    /*Modal ChangeUser*/
    const [showChangeUser, setshowChangeUser] = useState(false);
    const handleCloseChangeConcepto = () => setshowChangeUser(false);
    const handleShowChangeUser = () => setshowChangeUser(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/admin/red/legend');
                setLegend(response.data.data);
            } catch (error) {
                showNotification("Error al cargar leyenda", 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const tree = $(treeRef.current).jstree({
            core: {
                data: function (node, callback) {
                    if (node.id === '#') {
                        const data = { user_id: user_data.id, nivel: 0 };
                        apiClient.post('/admin/red/list', data)
                            .then(response => {
                                const childNodes = response.data.map((item) => ({
                                    id: item.user_id,
                                    text: `<span style="color: ${item.color}">${item.nivel} ${item.username}</span>`,
                                    children: item.dropdown,
                                    icon: item.dropdown ? 'jstree-folder' : 'jstree-file',
                                    nivel_actual: item.nivel_actual,
                                }));
                                callback(childNodes);
                            })
                            .catch(error => {
                                showNotification("Error al cargar la red", 'error');
                            });
                    } else {
                        const data = { user_id: node.id, nivel: node.original.nivel_actual };
                        apiClient.post('/admin/red/list', data)
                            .then(response => {
                                const childNodes = response.data.map((item) => ({
                                    id: item.user_id,
                                    text: `<span style="color: ${item.color}">${item.nivel} ${item.username}</span>`,
                                    children: item.dropdown,
                                    icon: item.dropdown ? 'jstree-folder' : 'jstree-file',
                                    nivel_actual: item.nivel_actual,
                                }));
                                callback(childNodes);
                            })
                            .catch(error => {
                                showNotification("Error al cargar la red");
                            });
                    }
                },
                themes: {
                    name: 'default',
                    dots: true,
                    icons: true,
                },
            },
            plugins: ['wholerow'],
        });

        $(treeRef.current).on('click', '.jstree-anchor', function (e) {
            const nodeId = $(this).closest('li').attr('id');
            handleShowChangeUser();
            setIsLoading(true);
            apiClient.get(`admin/red/detail/${nodeId}`)
                .then(response => {
                    setUser(response.data.data);
                })
                .catch(error => {
                    showNotification(error.response?.data?.message || "Error al ver detalle de usuario", 'error');
                })
                .finally(() => {
                    setIsLoading(false);
                })
        });

        setTimeout(() => {
            $(treeRef.current).find('.jstree-no-dots').removeClass('jstree-no-dots');
        }, 5000);

        // Evento para recalcular las líneas al expandir un nodo
        $(treeRef.current).on('open_node.jstree', () => {
            $(treeRef.current).find('.jstree-no-dots').removeClass('jstree-no-dots');
        });

        return () => {
            tree.jstree('destroy');
        };
    }, []);



    return (
        <>
            <div className="card">
                <div className="card-header align-items-center">
                    <h5 className="mb-0 text-md-start text-center">Mi Red de Afiliados</h5>
                </div>
                <div className="card-body table-responsive">
                    {!loading && (
                        <ul className="legend-list d-block d-md-flex mb-5 mt-3">
                            {legend.map((item, index) => (
                                <li key={index}>
                                    <div className="color-box" style={{ 'background-color': item.color }}></div>
                                    <span className='text'>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div ref={treeRef}></div>
                </div>
            </div>

            <Modal
                show={showChangeUser}
                onHide={handleCloseChangeConcepto}
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <p className='text-center'>Cargando Datos...</p>
                    ) : (
                        user && (
                            <div className="row g-2">
                                <div className="col-12 mb-4 d-flex justify-content-center">
                                    <img src={user.photo} alt="user-avatar" className="d-block object-fit-contain" height="150" width="150" />
                                </div>
                                <div className="col-12 col-md-6 mb-2">
                                    <label className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.nombre}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-2">
                                    <label className="form-label">Codigo</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.codigo}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-2">
                                    <label className="form-label">Rango</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.rango}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-2">
                                    <label className="form-label">Celular</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.celular}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-2">
                                    <label className="form-label">Puntos personales</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.pts_personales}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-2">
                                    <label className="form-label">Puntos para calificación</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={user.pts_calificacion}
                                        disabled
                                    />
                                </div>
                            </div>
                        )
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};
