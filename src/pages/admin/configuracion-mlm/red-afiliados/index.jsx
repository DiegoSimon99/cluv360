import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";

export const Index = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [photos, setPhotos] = useState({
    photo1: null,
    photo2: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await apiClient.get("/admin/config/affiliate-user");
        if (response.data.success) {
          const data = response.data.data;
          setFormData(data);
          setPhotos({
            photo1: data.bono_meta_img ? { name: "image_uploaded_1", preview: data.bono_meta_img, isNew: false } : null,
            photo2: data.bono_meta_img_1
              ? { name: "image_uploaded_2", preview: data.bono_meta_img_1, isNew: false }
              : null,
            photo3: data.bono_meta_img_2
              ? { name: "image_uploaded_3", preview: data.bono_meta_img_2, isNew: false }
              : null,
            photo4: data.pts_personales_photo
              ? { name: "image_uploaded_4", preview: data.pts_personales_photo, isNew: false }
              : null,
            photo5: data.pts_canje_photo
              ? { name: "image_uploaded_5", preview: data.pts_canje_photo, isNew: false }
              : null,
            photo6: data.pts_rango_photo
              ? { name: "image_uploaded_6", preview: data.pts_rango_photo, isNew: false }
              : null,
          });
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al obtener configuraciones", "error");
      }
    };

    fetchSetting();
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

  const { getRootProps: getRootProps4, getInputProps: getInputProps4 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo4"),
    accept: { "image/*": [] },
    multiple: false,
  });

  const { getRootProps: getRootProps5, getInputProps: getInputProps5 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo5"),
    accept: { "image/*": [] },
    multiple: false,
  });

  const { getRootProps: getRootProps6, getInputProps: getInputProps6 } = useDropzone({
    onDrop: (files) => onDropPhoto(files, "photo6"),
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
      showNotification("Es obligatorio subir la foto principal.", "error");
      return;
    }

    const data = new FormData();
    data.append("_method", "PATCH");

    if (photos.photo1?.isNew) {
      data.append("bono_meta_img", photos.photo1);
    }

    if (photos.photo2?.isNew) {
      data.append("bono_meta_img_1", photos.photo2);
    }

    if (photos.photo3?.isNew) {
      data.append("bono_meta_img_2", photos.photo3);
    }

    if (photos.photo4?.isNew) {
      data.append("pts_personales_photo", photos.photo4);
    }

    if (photos.photo5?.isNew) {
      data.append("pts_canje_photo", photos.photo5);
    }

    if (photos.photo6?.isNew) {
      data.append("pts_rango_photo", photos.photo6);
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, value[0]);
      } else {
        if (
          key != "bono_meta_img_1" &&
          key != "bono_meta_img_2" &&
          key != "bono_meta_img" &&
          key != "pts_personales_photo" &&
          key != "pts_canje_photo" &&
          key != "pts_rango_photo"
        ) {
          data.append(key, value);
        }
      }
    });

    removedFiles.forEach((url, index) => {
      data.append("removedPhotos[]", url); // Agregar directamente la URL
    });

    setLoading(true);
    try {
      const response = await apiClient.post(`/admin/config/affiliate-user`, data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar rango", "error");
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

  return (
    <>
      <div className="card">
        <div className="card-body">
          {formData ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <h5 className="mb-0 text-md-start text-center">Información de Bonos por Metas</h5>
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
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Descripión General</label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    name="bono_meta_title"
                    value={formData.bono_meta_title}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row mb-4">
                <h5 className="mb-0 text-md-start text-center">Carrousel de Bonos por Metas</h5>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Foto 1</label>
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
                <label className="col-sm-2 col-form-label">Titulo 1</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="bono_meta_title_1"
                    value={formData.bono_meta_title_1}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Descripción 1</label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    name="bono_meta_description_1"
                    onChange={handleChange}
                    value={formData.bono_meta_description_1}
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Foto 2</label>
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
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
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
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Titulo 2</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="bono_meta_title_2"
                    value={formData.bono_meta_title_2}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Descripción 2</label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    name="bono_meta_description_2"
                    onChange={handleChange}
                    value={formData.bono_meta_description_2}
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row mb-4">
                <h5 className="mb-0 text-md-start text-center">Puntos personales</h5>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Foto</label>
                <div className="col-sm-10">
                  {!photos.photo4 && (
                    <div
                      {...getRootProps4()}
                      style={{
                        border: "2px dashed #cccccc",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input {...getInputProps4()} />
                      <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                    </div>
                  )}
                  {photos.photo4 && (
                    <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={photos.photo4.preview}
                          alt="preview"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                          onClick={() => removePhoto("photo4")}
                        >
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
                  <textarea
                    className="form-control"
                    name="pts_personales_description"
                    onChange={handleChange}
                    value={formData.pts_personales_description}
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row mb-4">
                <h5 className="mb-0 text-md-start text-center">Puntos para canje</h5>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Foto</label>
                <div className="col-sm-10">
                  {!photos.photo5 && (
                    <div
                      {...getRootProps5()}
                      style={{
                        border: "2px dashed #cccccc",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input {...getInputProps5()} />
                      <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                    </div>
                  )}
                  {photos.photo5 && (
                    <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={photos.photo5.preview}
                          alt="preview"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                          onClick={() => removePhoto("photo5")}
                        >
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
                  <textarea
                    className="form-control"
                    name="pts_canje_description"
                    onChange={handleChange}
                    value={formData.pts_canje_description}
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row mb-4">
                <h5 className="mb-0 text-md-start text-center">Puntos para rango</h5>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Foto</label>
                <div className="col-sm-10">
                  {!photos.photo6 && (
                    <div
                      {...getRootProps6()}
                      style={{
                        border: "2px dashed #cccccc",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input {...getInputProps6()} />
                      <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                    </div>
                  )}
                  {photos.photo6 && (
                    <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={photos.photo6.preview}
                          alt="preview"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                          onClick={() => removePhoto("photo6")}
                        >
                          <i className="bx bx-x"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-4">
                <label className="col-sm-2 col-form-label">Descripción</label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    name="pts_rango_description"
                    onChange={handleChange}
                    value={formData.pts_rango_description}
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row justify-content-end">
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
