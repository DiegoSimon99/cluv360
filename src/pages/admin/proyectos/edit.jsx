import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useDropzone } from "react-dropzone";
import { showNotification } from '../../../utils/greetingHandler';
import apiClient from '../../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapsComponent from '../../../components/admin/GoogleMapsComponent';

export const Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [formData, setFormData] = useState({
        titulo: "",
        lotes_vendidos: "",
        lotes_total: "",
        metros: "",
        precio: "",
        moneda: "",
        latitud: 0,
        longitud: 0,
        direccion: "",
        descripcion: "",
        file: "",
        btn_1: "",
        btn_2: "",
    });

    const [files, setFiles] = useState([]);

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
                isNew: true, // Indica que es una nueva imagen
            })
        );

        setFiles((prevFiles) => prevFiles.concat(newFiles));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [] // Aceptar solo imágenes
        },
        multiple: true, // Permitir múltiples archivos
    });

    useEffect(() => {
        setLoading(true);
        apiClient.get(`/admin/proyectos/edit/${id}`)
            .then(response => {
                if (response.data.success) {
                    setProyecto(response.data.data);
                    const data = response.data.data;
                    setFormData({
                        titulo: data.titulo || "",
                        lotes_vendidos: data.lotes_vendidos || "",
                        lotes_total: data.lotes_total || "",
                        metros: data.metros || "",
                        precio: data.precio || "",
                        moneda: data.moneda || "",
                        latitud: parseFloat(data.latitud) || 0,
                        longitud: parseFloat(data.longitud) || 0,
                        direccion: data.direccion || "",
                        descripcion: data.descripcion || "",
                        file: data.file || "",
                        btn_1: data.btn_1 || "",
                        btn_2: data.btn_2 || ""
                    });
                    setVideo(data.video);
                    const initialFiles = data.photos.map((url, index) => ({
                        name: `image_${index}`, // Puedes generar un nombre único
                        preview: url,          // La URL que viene del endpoint
                        isNew: false           // Diferencia de las nuevas imágenes
                    }));
                    setFiles(initialFiles);
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al obtener proyecto", 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Liberar las URLs creadas cuando se desmonta el componente o cambia el estado
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    const removeFile = (fileName) => {
        console.log("remove")
        setFiles((prevFiles) => {
            const fileToRemove = prevFiles.find((file) => file.name === fileName);
            if (fileToRemove && !fileToRemove.isNew) {
                setRemovedFiles((prev) => [...prev, fileToRemove]); // Agregar a eliminados si no es nuevo
            }
            return prevFiles.filter((file) => file.name !== fileName); // Remover el archivo de la lista
        });
    };


    const handleChangeVideo = (newValue) => {
        setVideo(newValue || []);
    };

    const handleSubmitProyecto = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            showNotification("Es obligatorio subir al menos una imagen.", "error");
            return;
        }

        const data = new FormData();
        data.append("_method", "PATCH");

        // Recorrer `formData` y asegurarte de enviar valores simples
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Si el valor es un arreglo, toma el primer elemento
                data.append(key, value[0]);
            } else {
                data.append(key, value);
            }
        });

        // Filtrar las imágenes nuevas y existentes
        const newFiles = files.filter((file) => file.isNew);
        console.log("Archivos nuevos a enviar:", newFiles);
        const existingFiles = files.filter((file) => !file.isNew);

        // Agregar las imágenes nuevas al FormData
        newFiles.forEach((file, index) => {
            if (file?.preview && file?.isNew) { // Asegúrate de que tenga las propiedades necesarias
                console.log(`Agregando archivo nuevo ${index}:`, file);
                data.append("newPhotos[]", file);
            } else {
                console.error(`Elemento no válido en newFiles[${index}]:`, file);
            }
        });

        // Agregar las URLs de las imágenes existentes al FormData
        existingFiles.forEach((file, index) => {
            console.log(`Manteniendo archivo existente ${index}:`, file.preview);
            data.append("keptPhotos[]", file.preview); // Agregar solo la URL de la imagen
        });

        // Agregar las URLs de las imágenes eliminadas al FormData
        removedFiles.forEach((file, index) => {
            console.log(`Agregando archivo eliminado ${index}:`, file.preview);
            data.append("removedPhotos[]", file.preview); // Agregar solo la URL de la imagen eliminada
        });

        // Añadir los tags al FormData como un string separado por comas
        const tagsValue = video.map((tag) => tag.value).join(",");
        data.append("video", tagsValue);

        for (let pair of data.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        setLoading(true);
        apiClient.post(`/admin/proyectos/update/${id}`, data)
            .then(response => {
                response.data.message.forEach(item => {
                    showNotification(item.message, item.type);
                })
                if (response.data.success) {
                    navigate('/admin/proyectos');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar proyecto", 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleChangeProyecto = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información del proyecto</h5>
                    </div>
                </div>
                <div className="card-body">
                    {proyecto ? (
                        <form onSubmit={handleSubmitProyecto}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Nombre</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Lotes vendidos</label>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="lotes_vendidos"
                                        value={formData.lotes_vendidos}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Lotes Total</label>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="lotes_total"
                                        value={formData.lotes_total}
                                        onChange={handleChangeProyecto}
                                        required />
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
                                                    type="button"
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
                                <label className="col-sm-2 col-form-label">Metros</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="metros"
                                        value={formData.metros}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Precio</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Moneda</label>
                                <div className="col-sm-10">
                                    <select
                                        name="moneda"
                                        className='form-select'
                                        value={formData.moneda}
                                        onChange={handleChangeProyecto}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="PEN">PEN</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Video</label>
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
                                <label className="col-sm-2 col-form-label">Archivo</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="file"
                                        value={formData.file}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Dirección</label>
                                <div className="col-sm-10">
                                    {formData.latitud !== 0 && formData.longitud !== 0 && (
                                        <GoogleMapsComponent formData={formData} setFormData={setFormData} />
                                    )}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Botón (Más Información)</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="btn_1"
                                        value={formData.btn_1}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Botón (Ver plano del proyecto)</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="btn_2"
                                        value={formData.btn_2}
                                        onChange={handleChangeProyecto}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Descripción</label>
                                <div className="col-sm-10">
                                    <textarea
                                        className="form-control"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChangeProyecto}
                                        required>
                                    </textarea>
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