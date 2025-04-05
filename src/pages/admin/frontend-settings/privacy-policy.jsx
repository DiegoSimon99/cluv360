import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import { showNotification } from "../../../utils/greetingHandler";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";

export const Index = () => {
  const location = useLocation();
  const lastSegment = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const title = "Política de privacidad";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/admin/policies/${lastSegment}`);
        setFormData(response.data.data);
      } catch (error) {
        showNotification("Error al consultar la configuración", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formToSend = {
        ...formData,
        title: title,
      };
      const response = await apiClient.post(`/admin/policies/store`, formToSend);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch {
      showNotification("Error al guardar la configuración", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEditor = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">{title}</h5>
          </div>
        </div>
        <div className="card-body">
          {!formData ? (
            <p className="text-center">Cargando información...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Cotenido</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={formData.content}
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
          )}
        </div>
      </div>
    </>
  );
};
