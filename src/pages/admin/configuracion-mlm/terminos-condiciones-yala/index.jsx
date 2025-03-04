import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import { showNotification } from "../../../../utils/greetingHandler";
import ReactQuill from "react-quill";

export const Index = () => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ obj: {} });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/admin/config/terminos-condiciones-yala");
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
            const response = await apiClient.post(`/admin/config/terminos-condiciones-yala`, formData);
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

    const handleChangeEditor = (value) => {
        setFormData((prev) => ({
            ...prev,
            obj: {
                ...prev.obj,
                ["127"]: value,
            },
        }));
    };


    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Términos y Condiciones (Yala)</h5>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Cargando información...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Cotenido</label>
                                <div className="col-sm-10">
                                    <ReactQuill
                                        value={formData.obj["127"]}
                                        onChange={handleChangeEditor}
                                        theme="snow"
                                        modules={{
                                            toolbar: [
                                                [{ header: [1, 2, false] }],
                                                ["bold", "italic", "underline", "strike"],
                                                [{ list: "ordered" }, { list: "bullet" }],
                                                ["link", "image"],
                                                ["clean"],
                                            ],
                                        }}
                                    />
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
