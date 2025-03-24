import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";

export const Edit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [photos, setPhotos] = useState({
    photo1: null,
  });
  const [formData, setFormData] = useState({
    descripcion: "",
    enlace: "",
    sugerencia: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get(`/admin/publications/${id}`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setFormData({
            descripcion: data.descripcion || "",
            enlace: data.enlace || "",
            sugerencia: data.sugerencia || "",
          });
          setPhotos({
            photo1: data.imagen ? { name: "image_uploaded_1", preview: data.imagen, isNew: false } : null,
          });
        } else {
          showNotification(response.data.message, "error");
        }
      })
      .catch((error) => {
        showNotification(error.response?.data?.message || "Error al consultar publicación", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        isNew: true,
      }),
    }));
  };

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo1"),
    accept: { "image/*": [] },
    multiple: false,
  });

  const removePhoto = (fieldName) => {
    setPhotos((prev) => {
      const fileToRemove = prev[fieldName];

      if (fileToRemove && !fileToRemove.isNew) {
        setRemovedFiles((prevRemoved) => [...prevRemoved, fileToRemove.preview]); // Guarda la URL
      }

      return {
        ...prev,
        [fieldName]: null, // Borra solo la imagen específica
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photos.photo1) {
      showNotification("Es obligatorio subir la imagen.", "error");
      return;
    }

    if (!formData.descripcion) {
      showNotification("Es obligatorio la descripción.", "error");
      return;
    }

    const data = new FormData();
    data.append("_method", "PATCH");

    if (photos.photo1?.isNew) {
      data.append("avatar", photos.photo1);
    }

    removedFiles.forEach((url) => {
      data.append("removedPhotos[]", url);
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, value[0]);
      } else {
        data.append(key, value);
      }
    });

    setLoading(true);
    apiClient
      .post(`/admin/publications/${id}`, data)
      .then((response) => {
        if (response.data.success) {
          showNotification(response.data.message, "success");
          navigate("/admin/publications");
        } else {
          showNotification(response.data.message, "error");
        }
      })
      .catch((error) => {
        showNotification(error.response?.data?.message || "Error al actualizar la publicación", "error");
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
            <h5 className="mb-0 text-md-start text-center">Información de la publicacion</h5>
          </div>
        </div>
        <div className="card-body">
          {!isLoading ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Descripción</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Imagen</label>
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
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Enlace personalizado</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="enlace"
                    value={formData.enlace}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Sugerencias</label>
                <div className="col-sm-10">
                  <textarea className="form-control" name="sugerencia" onChange={handleChange} required>
                    {formData.sugerencia}
                  </textarea>
                </div>
              </div>
              <div className="row justify-content-end mt-4 mt-md-0">
                <div className="col-sm-10 text-end">
                  <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loading}>
                    <div className="d-flex align-items-center">
                      {loading && (
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      Guardar
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p>Cargando Información...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
