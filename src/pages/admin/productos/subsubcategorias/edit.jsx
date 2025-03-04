import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';
import { useDropzone } from 'react-dropzone';
import { useLoading } from '../../../../layouts/admin/contexts/LoadingContext';

export const Edit = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const [photos, setPhotos] = useState({
        photo1: null,
        photo2: null
    });
    const [formData, setFormData] = useState({
        name: "",
        category_id: null,
        sub_category_id: null,
        meta_title: "",
        meta_description: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/admin/subcategories/categories');
                setCategories(response.data)
            } catch (error) {
                showNotification("Ocurrio un error al obtener lista de categorías", 'error');
            }
        };

        fetchData();

        setIsLoading(true);
        apiClient.get(`/admin/subsubcategories/${id}`)
            .then(response => {
                if (response.data.success) {
                    const data = response.data.data;
                    setFormData({
                        name: data.name || "",
                        category_id: data.category_id || null,
                        sub_category_id: data.sub_category_id || null,
                        meta_title: data.meta_title || "",
                        meta_description: data.meta_description || ""
                    });
                    fetchDataSubCategories(data.category_id);
                    setPhotos({
                        photo1: data.image ? { name: "image_uploaded_1", preview: data.image, isNew: false } : null,
                        photo2: data.banner ? { name: "image_uploaded_2", preview: data.banner, isNew: false } : null
                    });
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al obtener sub subcategoría", 'error');
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

    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
        useDropzone({
            onDrop: (files) => onDropPhoto(files, "photo2"),
            accept: { "image/*": [] },
            multiple: false,
        });

    const removePhoto = (fieldName) => {
        setPhotos((prev) => {
            const fileToRemove = prev[fieldName];

            if (fileToRemove && !fileToRemove.isNew) {
                setRemovedFiles((prevRemoved) => [
                    ...prevRemoved,
                    { url: fileToRemove.preview, fieldName: getSetFieldName(fieldName) }
                ]);
            }

            return {
                ...prev,
                [fieldName]: null,
            };
        });
    };

    const getSetFieldName = (fieldName) => {
        switch (fieldName) {
            case 'photo1':
                return 'image'
                break;
            case 'photo2':
                return 'banner'
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("_method", "PATCH");

        if (photos.photo1?.isNew) {
            data.append("image", photos.photo1);
        }

        if (photos.photo2?.isNew) {
            data.append("banner", photos.photo2);
        }

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                data.append(key, value[0]);
            } else {
                data.append(key, value);
            }
        });

        data.append("removedPhotos", JSON.stringify(removedFiles));

        setLoading(true);
        apiClient.post(`/admin/subsubcategories/${id}`, data)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/subsubcategories');
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar Sub SubCategoría", 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category_id') {
            fetchDataSubCategories(value);
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchDataSubCategories = async (category_id) => {
        try {
            showLoading();
            const data = { category_id: category_id }
            const response = await apiClient.post('/admin/subsubcategories/subcategories', data);
            setSubCategories(response.data)
        } catch (error) {
            showNotification("Ocurrio un error al obtener lista de sub categorías", 'error');
        } finally {
            hideLoading();
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información de Sub SubCategoría</h5>
                    </div>
                </div>
                <div className="card-body">
                    {!isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Nombre</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Categoría</label>
                                <div className="col-sm-10">
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        className='form-select'
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {categories.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">SubCategoría</label>
                                <div className="col-sm-10">
                                    <select
                                        name="sub_category_id"
                                        className='form-select'
                                        value={formData.sub_category_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {subcategories.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Foto Principal</label>
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
                            <div className="row mb-4">
                                <label className="col-sm-2 col-form-label">Banner</label>
                                <div className="col-sm-10">
                                    {!photos.photo2 && (
                                        <div {...getRootProps2()}
                                            style={{
                                                border: "2px dashed #cccccc",
                                                padding: "20px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                            }}>
                                            <input {...getInputProps2()} />
                                            <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                                        </div>
                                    )}
                                    {photos.photo2 && (
                                        <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                                            <div style={{ position: "relative" }}>
                                                <img
                                                    src={photos.photo2.preview}
                                                    alt="preview"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                                />
                                                <button
                                                    type='button'
                                                    className="btn btn-danger btn-xs"
                                                    style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                                                    onClick={() => removePhoto("photo2")}>
                                                    <i className="bx bx-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Meta Title</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className='form-control'
                                        name='meta_title'
                                        value={formData.meta_title}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Descripción</label>
                                <div className="col-sm-10">
                                    <textarea
                                        name="meta_description"
                                        className='form-control'
                                        onChange={handleChange}
                                    >
                                        {formData.meta_description}
                                    </textarea>
                                </div>
                            </div>
                            <div className="row justify-content-end mt-4 mt-md-0">
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