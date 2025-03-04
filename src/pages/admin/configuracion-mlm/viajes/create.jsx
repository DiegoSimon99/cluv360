import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useDropzone } from "react-dropzone";
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';
import ReactQuill from 'react-quill';

export const Create = () => {
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState([]);
    const [formData, setFormData] = useState({
        titulo: "",
        fecha: "",
        personas: "",
        description: ""
    });

    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const onDrop = (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter((file) =>
            file.type.startsWith("image/") // Verificar que el tipo MIME sea de imagen
        );

        // Mostrar alerta si se intenta subir un archivo no permitido
        if (filteredFiles.length < acceptedFiles.length) {
            showNotification("El archivo no es una imagen y fue descartado.", "error");
        }

        // Agregar los archivos reales al estado
        setFiles((prevFiles) =>
            prevFiles.concat(filteredFiles.map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) }) // Agregar previsualización
            ))
        );
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [] // Aceptar solo imágenes
        },
        multiple: true, // Permitir múltiples archivos
    });

    useEffect(() => {
        // Liberar las URLs creadas cuando se desmonta el componente o cambia el estado
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);


    const removeFile = (fileName) => {
        setFiles(files.filter((file) => file.name !== fileName)); // Eliminar archivo
    };

    const handleChangeVideo = (newValue) => {
        setVideo(newValue || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            showNotification("Es obligatorio subir al menos una imagen.", "error");
            return;
        }

        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                data.append(key, value[0]);
            } else {
                data.append(key, value);
            }
        });

        // Agregar las imágenes desde Dropzone
        files.forEach((file, index) => {
            if (file instanceof File) {
                data.append("photos[]", file);
            } else {
                console.error(`Elemento no válido en files[${index}]:`, file);
            }
        });

        const tagsValue = video.map((tag) => tag.value).join(",");
        data.append("videos", tagsValue);

        for (const pair of data.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        setLoading(true);
        apiClient.post(`/admin/config/viajes/store`, data)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/config/viajes');
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch(() => {
                showNotification("Error al guardar viaje", 'error');
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
                        <h5 className="mb-0 text-md-start text-center">Información del viaje</h5>
                    </div>
                </div>
                <div className="card-body">
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
                            <label className="col-sm-2 col-form-label">Fecha</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Cantidad Personas</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="personas"
                                    value={formData.personas}
                                    onChange={handleChange}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Enlaces Youtube</label>
                            <div className="col-sm-10">
                                <CreatableSelect
                                    isMulti
                                    onChange={handleChangeVideo}
                                    value={video}
                                    placeholder="Escriba y presione enter"
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Fotos</label>
                            <div className="col-sm-10">
                                <div
                                    {...getRootProps()}
                                    style={{
                                        border: "2px dashed #cccccc",
                                        padding: "20px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <p className='m-0'>Arrastra tus imágenes aquí o haz clic para seleccionarlas</p>
                                </div>
                                <div className="preview-container" style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                                    {files.map((file) => (
                                        <div key={file.name} style={{ margin: "10px", position: "relative" }}>
                                            <img
                                                src={file.preview}
                                                alt="preview"
                                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-danger btn-xs'
                                                style={{
                                                    position: "absolute",
                                                    top: "5px",
                                                    right: "5px",
                                                    width: "20px",
                                                    height: "20px"
                                                }}
                                                onClick={() => removeFile(file.name)}
                                            >
                                                <i className='bx bx-x'></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                        "Enviar "
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