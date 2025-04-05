import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";
import Select from "react-select";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    pick_up_status: null,
    staff_id: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoadingStaff(true);
        const response = await apiClient.get("/admin/pick_up_points/staffAll");
        const staffOptions = response.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setStaff(staffOptions);
      } catch (error) {
        showNotification("Ocurrio un error al obtener lista de staff", "error");
        setStaff([]);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.staff_id) {
      showNotification("Gerente de punto de recogida obligatorio", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/admin/pick_up_points/store`, formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        navigate("/admin/pick_up_points");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar Punto de recogida", "error");
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

  const handleCheckboxChange = async (e) => {
    const newStatus = e.target.checked ? 1 : null;
    setFormData((prev) => ({
      ...prev,
      pick_up_status: newStatus,
    }));
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Información de Punto de recogida</h5>
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
              <label className="col-sm-2 col-form-label">Ubicación</label>
              <div className="col-sm-10">
                <textarea name="address" className="form-control" onChange={handleChange} required>
                  {formData.address}
                </textarea>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Teléfono</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Estado del punto de recogida</label>
              <div className="col-sm-10">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.pick_up_status === 1}
                    onChange={(e) => handleCheckboxChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Gerente de punto de recogida</label>
              <div className="col-sm-10">
                <Select
                  options={staff}
                  isSearchable={true}
                  isClearable={true}
                  isLoading={loadingStaff}
                  placeholder={loadingStaff ? "Cargando..." : "Buscar staff..."}
                  value={staff.find((option) => option.value === formData.staff_id) || null}
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      staff_id: selectedOption.value,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="row justify-content-end mt-4 mt-md-0">
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
        </div>
      </div>
    </>
  );
};
