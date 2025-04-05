import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState({
    photo1: null,
  });
  const [formData, setFormData] = useState({
    type: "custom_payment",
    heading: "",
  });

  const type = [
    {
      value: "custom_payment",
      name: "Pago personalizado",
    },
    {
      value: "bank_payment",
      name: "Pago Bancario",
    },
    {
      value: "check_payment",
      name: "Pago con cheque",
    },
  ];

  const navigate = useNavigate();

  const onDropPhoto = (acceptedFiles, fieldName) => {
    const filteredFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));

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
      }),
    }));
  };

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
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

    const data = new FormData();

    if (photos.photo1) {
      data.append("photo", photos.photo1);
    } else {
      showNotification("Es obligatorio Miniatura de pago", "error");
      return;
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, value[0]);
      } else {
        data.append(key, value);
      }
    });

    try {
      setLoading(true);
      const response = await apiClient.post(`/admin/manual_payment_methods/store`, data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/manual_payment_methods");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar Método de pago manual", "error");
    } finally {
      setLoading(false);
    }
  };

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
            <h5 className="mb-0 text-md-start text-center">Información del Método de pago manual</h5>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Tipo</label>
              <div className="col-sm-10">
                <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
                  {type.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Nombre</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Miniatura de pago (438 x 235) px</label>
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
                        style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "5px" }}
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
              <label className="col-sm-2 col-form-label">Instrucción de pago</label>
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
        </div>
      </div>
    </>
  );
};
