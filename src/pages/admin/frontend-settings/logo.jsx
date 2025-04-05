import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import { useDropzone } from "react-dropzone";

export const Logo = () => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/admin/generalsettings/logo");
        const data = response.data.data;
        setId(data.id);
        setPhotos({
          photo1: data.logo ? { name: "image_uploaded_1", preview: data.logo, isNew: false } : null,
          photo2: data.admin_logo ? { name: "image_uploaded_2", preview: data.admin_logo, isNew: false } : null,
          photo3: data.favicon ? { name: "image_uploaded_2", preview: data.favicon, isNew: false } : null,
        });
      } catch (error) {
        showNotification("Error al consultar la configuración", "error");
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

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo2"),
    accept: { "image/*": [] },
    multiple: false,
  });

  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo3"),
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
    try {
      const data = new FormData();
      data.append("id", id);

      if (photos.photo1?.isNew) {
        data.append("logo", photos.photo1);
      }
      if (photos.photo2?.isNew) {
        data.append("admin_logo", photos.photo2);
      }
      if (photos.photo3?.isNew) {
        data.append("favicon", photos.photo3);
      }

      setLoading(true);
      const response = await apiClient.post(`/admin/generalsettings/logo`, data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar la configuración", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Configuración de Logo</h5>
          </div>
        </div>
        <div className="card-body">
          {!photos ? (
            <p className="text-center">Cargando información...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Frontend logo (max height 40px)</label>
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
                <label className="col-sm-2 col-form-label">Admin logo (60x60)</label>
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
                          style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "5px" }}
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
                <label className="col-sm-2 col-form-label">Favicon (32x32)</label>
                <div className="col-sm-10">
                  {!photos.photo3 && (
                    <div
                      {...getRootProps3()}
                      style={{
                        border: "2px dashed #cccccc",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input {...getInputProps3()} />
                      <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                    </div>
                  )}
                  {photos.photo3 && (
                    <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={photos.photo3.preview}
                          alt="preview"
                          style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "5px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                          onClick={() => removePhoto("photo3")}
                        >
                          <i className="bx bx-x"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-sm-10 text-end">
                  <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loading}>
                    {loading && (
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                    Guardar
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
