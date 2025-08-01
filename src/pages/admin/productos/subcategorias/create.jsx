import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";
import { useDropzone } from "react-dropzone";
import Select from "react-select";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [photos, setPhotos] = useState({
    photo1: null,
    photo2: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    category_id: null,
    meta_title: "",
    meta_description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiClient.get("/admin/subcategories/categories");
        const categoryOptions = response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setCategories(categoryOptions);
      } catch (error) {
        showNotification("Ocurrio un error al obtener lista de categorías", "error");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const onDropPhoto = (acceptedFiles, fieldName) => {
    const filteredFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));

    if (filteredFiles.length === 0) {
      showNotification("El archivo no es una imagen y fue descartado.", "error");
      return;
    }

    const selectedFile = filteredFiles[0];
    setPhotos((prev) => ({
      ...prev,
      [fieldName]: Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      }),
    }));
  };

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo1"),
    accept: { "image/*": [] },
    multiple: false,
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo2"),
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

    const data = new FormData();

    if (photos.photo1) {
      data.append("image", photos.photo1);
    }

    if (photos.photo2) {
      data.append("banner", photos.photo2);
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, value[0]);
      } else {
        data.append(key, value);
      }
    });

    setLoading(true);
    apiClient
      .post(`/admin/subcategories/store`, data)
      .then((response) => {
        if (response.data.success) {
          showNotification(response.data.message, "success");
          navigate("/admin/subcategories");
        } else {
          showNotification(response.data.message, "error");
        }
      })
      .catch((error) => {
        showNotification(error.response?.data?.message || "Error al guardar SubCategoría", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
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
            <h5 className="mb-0 text-md-start text-center">Información de SubCategoría</h5>
          </div>
        </div>
        <div className="card-body">
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
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Foto Principal</label>
              <div className="col-sm-10">
                {!photos.photo1 && (
                  <div
                    {...getRootProps1()}
                    style={{
                      border: "2px dashed #cccccc",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
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
                        type="button"
                        className="btn btn-danger btn-xs"
                        style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                        onClick={() => removePhoto("photo1")}
                      >
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
                  <div
                    {...getRootProps2()}
                    style={{
                      border: "2px dashed #cccccc",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
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
                        type="button"
                        className="btn btn-danger btn-xs"
                        style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                        onClick={() => removePhoto("photo2")}
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Categoría</label>
              <div className="col-sm-10">
                <Select
                  options={categories}
                  isSearchable={true}
                  isClearable={true}
                  isLoading={loadingCategories}
                  placeholder={loadingCategories ? "Cargando..." : "Buscar categoría..."}
                  value={categories.find((option) => option.value === formData.category_id) || null}
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      category_id: selectedOption ? selectedOption.value : null,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Meta Title</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Descripción</label>
              <div className="col-sm-10">
                <textarea name="meta_description" className="form-control" onChange={handleChange}>
                  {formData.meta_description}
                </textarea>
              </div>
            </div>
            <div className="row justify-content-end mt-4 mt-md-0">
              <div className="col-sm-10 text-end">
                <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loading}>
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
          <div className="text-center">
            <p>Cargando Información...</p>
          </div>
        </div>
      </div>
    </>
  );
};
