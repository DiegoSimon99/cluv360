import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';

export const Edit = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: ""
    });

    const [niveles, setNiveles] = useState([{
        porcentaje: ""
    }]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        apiClient.get(`/admin/config/proyectos/edit/${id}`)
            .then(response => {
                if (response.data.success) {
                    const data = response.data.data;
                    setFormData({
                        nombre: data.nombre || ""
                    });
                    setNiveles(data.niveles)
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al obtener proyecto", 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleSubmitRango = async (e) => {
        e.preventDefault();

        niveles.map((item, index) => (
            item.nivel = index+1
        ))

        formData.niveles = niveles;

        setLoading(true);
        apiClient.patch(`/admin/config/proyectos/${id}`, formData)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/config/proyectos/');
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar proyecto", 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Agregar una nueva fila
    const agregarFila = () => {
        setNiveles([...niveles, { porcentaje: "" }]);
    };

    // Eliminar una fila
    const eliminarFila = (index) => {
        const nuevosNiveles = [...niveles];
        nuevosNiveles.splice(index, 1);
        setNiveles(nuevosNiveles);
    };

    // Manejar cambios en los select e inputs
    const handleChangeNivel = (index, campo, valor) => {
        if (campo === "porcentaje") {
            // Permitir solo números y un punto decimal
            if (!/^\d*\.?\d*$/.test(valor)) {
                return;
            }
        }

        const nuevosNiveles = [...niveles];
        nuevosNiveles[index][campo] = valor;
        setNiveles(nuevosNiveles);
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información del Proyecto</h5>
                    </div>
                </div>
                <div className="card-body">
                    {!isLoading ? (
                        <form onSubmit={handleSubmitRango}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Nombre</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <table className='table table-hover'>
                                            <thead>
                                                <tr>
                                                    <th>Nivel</th>
                                                    <th>%</th>
                                                    <th>Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {niveles.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={index + 1}
                                                                disabled
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={item.porcentaje}
                                                                onChange={(e) => handleChangeNivel(index, "porcentaje", e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <button type="button" className="btn btn-danger" onClick={() => eliminarFila(index)}>
                                                                <i className="bx bx-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="text-center">
                                                <tr>
                                                    <td colSpan="3">
                                                        <button type="button" className="btn btn-secondary w-100" onClick={agregarFila}>
                                                            <i className="bx bx-plus"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-sm-10 text-end">
                                    <button aria-label='Click me' type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
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
                    ) : (
                        <div className='text-center'>
                            <p>Cargando Información...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}