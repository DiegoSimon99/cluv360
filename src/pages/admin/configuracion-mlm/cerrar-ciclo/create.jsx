import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';
import { useState } from 'react';

export const Create = () => {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fecha: "",
        premio: "",
        rango: "",
        niveles: "",
        pm_activacion: "",
        pm_mes: "",
        comision_mes: ""
    });

    const navigate = useNavigate();

    const handleSubmitCierreCiclo = async (e) => {
        e.preventDefault();

        setLoading(true);
        apiClient.post(`/admin/config/cierre-ciclo/store`, formData)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/config/cerrar-ciclo');
                } else {
                    showNotification("Error al cerrar ciclo", 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al cerrar ciclo", 'error');
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

    const handleReloadRango = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        apiClient.get(`/admin/config/cierre-ciclo/reload-rango`)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                } else {
                    showNotification("Error al actualizar rango de usuarios", 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar rango de usuarios", 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información del cierre de ciclo</h5>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitCierreCiclo}>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Fecha</label>
                            <div className="col-sm-10">
                                <input
                                    type="month"
                                    className="form-control"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">PREMIAR RANGO</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="premio"
                                    value={formData.premio}
                                    onChange={handleChange}
                                    required>
                                    <option value="">SELECCIONE</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">ASIGNAR RANGO AL PREMIADO</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="rango"
                                    value={formData.rango}
                                    onChange={handleChange}
                                    required>
                                    <option value="">SELECCIONE</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">ASIGNAR NIVELES APERTURADOS</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="niveles"
                                    value={formData.niveles}
                                    onChange={handleChange}
                                    required>
                                    <option value="">SELECCIONE</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">RESETEAR PUNTOS PERSONALES</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="pm_activacion"
                                    value={formData.pm_activacion}
                                    onChange={handleChange}
                                    required>
                                    <option value="">SELECCIONE</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">RESETEAR PUNTOS DE EQUIPO</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="pm_mes"
                                    value={formData.pm_mes}
                                    onChange={handleChange}
                                    required>
                                    <option value="">SELECCIONE</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">RESETEAR ACUMULADOR DE GANANCIAS</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="comision_mes"
                                    value={formData.comision_mes}
                                    onChange={handleChange}
                                    required>
                                    <option value="">SELECCIONE</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row justify-content-end">
                            <div className="col-sm-10 text-end">
                                <button aria-label='Click me' type="button" onClick={handleReloadRango} className="btn btn-success me-2" disabled={loading || isLoading}>
                                    {isLoading ? (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Actualizar Rango de Usuarios(4 veces)"
                                    )}
                                </button>
                                <button aria-label='Click me' type="submit" className="btn btn-primary" disabled={loading || isLoading}>
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Ejecutar Cierre "
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}