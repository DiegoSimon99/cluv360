import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const Ciclo = () => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ obj: {} });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/admin/config/ciclo");
                const data = response.data;
                const mappedFormData = data.reduce((acc, item) => {
                    acc[item.id] = item.value;
                    return acc;
                }, {});

                setFormData({ obj: mappedFormData });
            } catch (error) {
                showNotification("Error al obtener la configuración", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            const response = await apiClient.post(`/admin/config/ciclo`, formData);
            if (response.data.success) {
                showNotification(response.data.message, "success");
            } else {
                showNotification(response.data.message, "error");
            }
        } catch {
            showNotification("Error al guardar la configuración", "error");
        } finally {
            setFormLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            obj: {
                ...prev.obj,
                [name]: value,
            },
        }));
    };

    const handleDecimalInputChange = (e) => {
        const { name, value } = e.target;

        // Validar que solo contenga números y puntos decimales
        if (/^\d*\.?\d*$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                obj: {
                    ...prev.obj,
                    [name]: value,
                },
            }));
        }
    };


    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Configuración de Ciclo</h5>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Cargando información...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Contador para el cierre</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="104"
                                        value={formData.obj["104"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="0">NO</option>
                                        <option value="1">SI</option>
                                    </select>
                                </div>
                            </div>
                            {formData.obj["104"] === "1" && (
                                <div className="row mb-3">
                                    <label className="col-sm-2 col-form-label">Fecha del cierre</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="103"
                                            value={formData.obj["103"] || ""}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Activación Minima</label>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="87"
                                        value={formData.obj["87"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Puntos de activación</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="114"
                                        value={formData.obj["114"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="0">NO</option>
                                        <option value="1">SI</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Periodo actual</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="115"
                                        value={formData.obj["115"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="0">NO</option>
                                        <option value="1">SI</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Líneas activas por</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="102"
                                        value={formData.obj["102"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">Puntos personales</option>
                                        <option value="2">Puntos grupales</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Líneas activas - Puntaje minimo</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="88"
                                        value={formData.obj["88"] || ""}
                                        onChange={handleDecimalInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Decimales en puntos de activación</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="89"
                                        value={formData.obj["89"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="0">NO</option>
                                        <option value="1">SI</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Bono Global</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="98"
                                        value={formData.obj["98"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="0">NO</option>
                                        <option value="1">SI</option>
                                    </select>
                                </div>
                            </div>
                            {formData.obj["98"] === "1" && (
                                <div>
                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Desde el nivel</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="99"
                                                value={formData.obj["99"] || ""}
                                                onChange={handleInputChange}
                                                required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Pagar porcentaje</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="100"
                                                value={formData.obj["100"] || ""}
                                                onChange={handleDecimalInputChange}
                                                required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Pagar a</label>
                                        <div className="col-sm-10">
                                            <select
                                                className='form-select'
                                                name="101"
                                                value={formData.obj["101"] || ""}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="1">BILLETERA</option>
                                                <option value="2">ACUMULADOR DEL MES</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row justify-content-end">
                                <div className="col-sm-10 text-end">
                                    <button
                                        aria-label="Click me"
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? (
                                            <div
                                                className="spinner-border spinner-border-sm text-primary"
                                                role="status"
                                            >
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
        </>
    );
};
