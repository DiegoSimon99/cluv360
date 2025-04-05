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
  const [photos, setPhotos] = useState({
    photo1: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    amount_usd: "",
    discount: "",
    product_upload: "",
    bono_bussiness: "",
    niveles: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerPackage = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/admin/customer-package/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          setFormData({
            name: data.name || "",
            amount: data.amount || 0,
            amount_usd: data.amount_usd || 0,
            discount: data.discount || 0,
            product_upload: data.product_upload || 0,
            bono_bussiness: data.bono_bussiness || 0,
            niveles: data.niveles || 0,
          });
          setPhotos({
            photo1: data.logo ? { name: "image_uploaded_1", preview: data.logo, isNew: false } : null,
          });
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar paquete", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerPackage();
  }, []);

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
    setPhotos((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("_method", "PATCH");

    if (photos.photo1) {
      if (photos.photo1?.isNew) {
        data.append("logo", photos.photo1);
      }
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
      const response = await apiClient.post(`/admin/customer-package/${id}`, data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/customer-packages");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar paquete", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount" || name === "amount_usd" || name === "discount" || name === "bono_bussiness") {
      // Permitir solo números y máximo un punto decimal
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (!regex.test(value) && value !== "") return; // si no pasa, no actualices
    }

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
            <h5 className="mb-0 text-md-start text-center">Información del paquete</h5>
          </div>
        </div>
        <div className="card-body">
          {!isLoading ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Nombre del paquete</label>
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
                <label className="col-sm-2 col-form-label">Precio</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Precio USD</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="amount_usd"
                    value={formData.amount_usd}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Descuento</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Subir productos</label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    name="product_upload"
                    value={formData.product_upload}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Bono Bussinnes</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="bono_bussiness"
                    value={formData.bono_bussiness}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Niveles</label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    name="niveles"
                    value={formData.niveles}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Logo</label>
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
