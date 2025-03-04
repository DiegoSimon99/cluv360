import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const Red = () => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ obj: {} });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/admin/config/red");
                const data = response.data;
                const mappedFormData = data.reduce((acc, item) => {
                    acc[item.id] = item.value;
                    return acc;
                }, {});

                setFormData({ obj: mappedFormData });
            } catch (error) {
                showNotification("Error al obtener configuración de red", "error");
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
            const response = await apiClient.post(`/admin/config/red`, formData);
            if (response.data.success) {
                showNotification(response.data.message, "success");
            } else {
                showNotification(response.data.message, "error");
            }
        } catch {
            showNotification("Error al guardar configuración de red", "error");
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

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Configuración de Red</h5>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Cargando información...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Tipo de red</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="90"
                                        value={formData.obj["90"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">Red Lineal</option>
                                        <option value="2">Red Arbol</option>
                                    </select>
                                </div>
                            </div>
                            {formData.obj["90"] === "1" ? (
                                <div>
                                    <div className="row mb-3">
                                        <label className="col-sm-5 col-form-label">Usuario que no llegue a los puntos mínimos de activación</label>
                                        <div className="col-sm-7">
                                            <input
                                                type="color"
                                                className="form-control"
                                                name="91"
                                                value={formData.obj["91"] || ""}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-5 col-form-label">Usuario que esté activo</label>
                                        <div className="col-sm-7">
                                            <input
                                                type="color"
                                                className="form-control"
                                                name="92"
                                                value={formData.obj["92"] || ""}
                                                onChange={handleInputChange}
                                                required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-5 col-form-label">Usuario que no tenga ninguna actividad en el mes</label>
                                        <div className="col-sm-7">
                                            <input
                                                type="color"
                                                className="form-control"
                                                name="93"
                                                value={formData.obj["93"] || ""}
                                                onChange={handleInputChange}
                                                required />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="row mb-3">
                                        <label className="col-sm-5 col-form-label">Usuario que no llegue a los puntos mínimos de activación</label>
                                        <div className="col-sm-7">
                                            <input
                                                type="color"
                                                className="form-control"
                                                name="94"
                                                value={formData.obj["94"] || ""}
                                                onChange={handleInputChange}
                                                required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-5 col-form-label">Usuario que esté activo</label>
                                        <div className="col-sm-7">
                                            <input
                                                type="color"
                                                className="form-control"
                                                name="95"
                                                value={formData.obj["95"] || ""}
                                                onChange={handleInputChange}
                                                required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-5 col-form-label">Usuario que no tenga ninguna actividad en el mes</label>
                                        <div className="col-sm-7">
                                            <input
                                                type="color"
                                                className="form-control"
                                                name="96"
                                                value={formData.obj["96"] || ""}
                                                onChange={handleInputChange}
                                                required />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Mostrar total de directos</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="106"
                                        value={formData.obj["106"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">SI</option>
                                        <option value="0">NO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Mostrar total de personas en la red</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="107"
                                        value={formData.obj["107"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">SI</option>
                                        <option value="0">NO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Mostrar código de usuario</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="108"
                                        value={formData.obj["108"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">SI</option>
                                        <option value="0">NO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Mostrar rango</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="109"
                                        value={formData.obj["109"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">SI</option>
                                        <option value="0">NO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Mostrar Puntos de Calificación</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="112"
                                        value={formData.obj["112"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">SI</option>
                                        <option value="0">NO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Mostrar todos los niveles</label>
                                <div className="col-sm-7">
                                    <select
                                        className='form-select'
                                        name="110"
                                        value={formData.obj["110"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="1">SI</option>
                                        <option value="0">NO</option>
                                    </select>
                                </div>
                            </div>
                            {formData.obj["110"] === "0" && (
                                <div className="row mb-3">
                                    <label className="col-sm-5 col-form-label">Listar hasta el nivel</label>
                                    <div className="col-sm-7">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="111"
                                            value={formData.obj["111"] || ""}
                                            onChange={handleInputChange}
                                            required />
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
