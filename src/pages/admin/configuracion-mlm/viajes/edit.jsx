import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';
import ReactQuill from 'react-quill';

export const Edit = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [video, setVideo] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [formData, setFormData] = useState({
        titulo: "",
        fecha: "",
        personas: "",
        description: ""
    });

    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        apiClient.get(`/admin/config/viajes/edit/${id}`)
            .then(response => {
                if (response.data.success) {
                    const data = response.data.data;
                    setFormData({
                        title: data.title || "",
                        fecha: data.fecha || "",
                        personas: data.personas || "",
                        description: data.description || ""
                    });
                    const initialFiles = data.photo.map((url, index) => ({
                        name: `image_${index}`, // Puedes generar un nombre único
                        preview: url,          // La URL que viene del endpoint
                        isNew: false           // Diferencia de las nuevas imágenes
                    }));
                    setVideo(data.videos);
                    setFiles(initialFiles);
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al obtener viaje", 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const onDrop = (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        if (filteredFiles.length < acceptedFiles.length) {
            showNotification("El archivo no es una imagen y fue descartado.", "error");
        }

        const newFiles = filteredFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                isNew: true, 
            })
        );

        setFiles((prevFiles) => prevFiles.concat(newFiles));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": []
        },
        multiple: true,
    });

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);


    const removeFile = (fileName) => {
        setFiles((prevFiles) => {
            const fileToRemove = prevFiles.find((file) => file.name === fileName);
            if (fileToRemove && !fileToRemove.isNew) {
                setRemovedFiles((prev) => [...prev, fileToRemove]);
            }
            return prevFiles.filter((file) => file.name !== fileName);
        });
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
        data.append("_method", "PATCH");

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

        // Filtrar las imágenes nuevas y existentes
        const newFiles = files.filter((file) => file.isNew);
        const existingFiles = files.filter((file) => !file.isNew);

        // Agregar las imágenes nuevas al FormData
        newFiles.forEach((file, index) => {
            if (file?.preview && file?.isNew) { // Asegúrate de que tenga las propiedades necesarias
                data.append("newPhotos[]", file);
            } else {
                console.error(`Elemento no válido en newFiles[${index}]:`, file);
            }
        });

        // Agregar las URLs de las imágenes existentes al FormData
        existingFiles.forEach(file => {
            data.append("keptPhotos[]", file.preview); // Agregar solo la URL de la imagen
        });

        // Agregar las URLs de las imágenes eliminadas al FormData
        removedFiles.forEach(file => {
            data.append("removedPhotos[]", file.preview); // Agregar solo la URL de la imagen eliminada
        });

        const tagsValue = video.map((tag) => tag.value).join(",");
        data.append("videos", tagsValue);

        setLoading(true);
        apiClient.post(`/admin/config/viajes/${id}`, data)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/config/viajes');
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch(() => {
                showNotification("Error al actualizar viaje", 'error');
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