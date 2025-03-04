import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";

export const General = () => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ obj: {} });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/admin/config/general");
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
            const response = await apiClient.post(`/admin/config/general`, formData);
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
                        <h5 className="mb-0 text-md-start text-center">Configuración General</h5>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Cargando información...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Versión Android</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="65"
                                        value={formData.obj["65"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Versión iOS</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="71"
                                        value={formData.obj["71"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Productos Gratis</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="77"
                                        value={formData.obj["77"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Porcentaje Inversión</label>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="78"
                                        value={formData.obj["78"] || ""}
                                        onChange={handleDecimalInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Video Tarea</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="79"
                                        value={formData.obj["79"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Patrocinador</label>
                                <div className="col-sm-10">
                                    <select
                                        className='form-select'
                                        name="113"
                                        value={formData.obj["113"] || ""}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">SELECCIONAR</option>
                                        <option value="0">NO</option>
                                        <option value="1">SI</option>
                                    </select>
                                </div>
                            </div>
                            {formData.obj["113"] === "1" && (
                                <div className="row mb-3">
                                    <label className="col-sm-2 col-form-label">Puntaje Minimo patrocinador</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="80"
                                            value={formData.obj["80"] || ""}
                                            onChange={handleDecimalInputChange}
                                            required />
                                    </div>
                                </div>
                            )}
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Fecha Minima Geolocalización de Negocios</label>
                                <div className="col-sm-10">
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="81"
                                        value={formData.obj["81"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Token Quertium</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="116"
                                        value={formData.obj["116"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Api key webhooksms</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="117"
                                        value={formData.obj["117"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Secret webhooksms</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="118"
                                        value={formData.obj["118"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Site key reCaptcha</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="120"
                                        value={formData.obj["120"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Secret key reCaptcha</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="121"
                                        value={formData.obj["121"] || ""}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>

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
