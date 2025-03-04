import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from 'react-dropzone';

export const Edit = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState({
        photo1: null,
    });
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        apiClient.get(`/admin/config/noticias/edit/${id}`)
            .then(response => {
                if (response.data.success) {
                    const data = response.data.data;
                    setFormData({
                        title: data.title || "",
                        description: data.description || ""
                    });
                    setPhotos({
                        photo1: data.photo ? { name: "image_uploaded_1", preview: data.photo, isNew: false } : null
                    });
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al obtener noticia", 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const onDropPhoto = (acceptedFiles, fieldName) => {
        const filteredFiles = acceptedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        if (filteredFiles.length === 0) {
            showNotification("El archivo no es una imagen y fue descartado.", "error");
            return;
        }

        // Solo permitir una imagen (toma la primera)
        const selectedFile = filteredFiles[0];
        setPhotos((prev) => ({
            ...prev,
            [fieldName]: Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile),
                isNew: true
            }),
        }));
    };

    const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
        useDropzone({
            onDrop: (files) => onDropPhoto(files, "photo1"),
            accept: { "image/*": [] },
            multiple: false,
        });

    const removePhoto = (fieldName) => {
        setPhotos((prev) => ({
            ...prev,
            [fieldName]: null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!photos.photo1) {
            showNotification("Es obligatorio subir la foto de la noticia.", "error");
            return;
        }

        const data = new FormData();
        data.append("_method", "PATCH");

        if (photos.photo1?.isNew) {
            data.append("photo", photos.photo1);
        }

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                data.append(key, value[0]);
            } else {
                data.append(key, value);
            }
        });

        setLoading(true);
        apiClient.post(`/admin/config/noticias/${id}`, data)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/config/noticias');
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar noticia", 'error');
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

    const handleChangeEditor = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información de noticia</h5>
                    </div>
                </div>
                <div className="card-body">
                    {!isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Título</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Foto</label>
                                <div className="col-sm-10">
                                    {!photos.photo1 && (
                                        <div {...getRootProps1()}
                                            style={{
                                                border: "2px dashed #cccccc",
                                                padding: "20px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                            }}>
                                            <input {...getInputProps1()} />
                                            <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                                        </div>
                                    )}
                                    {photos.photo1 && (
                                        <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                                            <div style={{ position: "relative" }}>
                                                <img
                                                    src={photos.photo1.preview}
                                                    alt="preview"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                                />
                                                <button
                                                    type='button'
                                                    className="btn btn-danger btn-xs"
                                                    style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                                                    onClick={() => removePhoto("photo1")}>
                                                    <i className="bx bx-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Descripción</label>
                                <div className="col-sm-10">
                                    <ReactQuill
                                        value={formData.description}
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