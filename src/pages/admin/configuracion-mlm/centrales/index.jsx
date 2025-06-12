import { useEffect, useState } from "react";
import { showNotification } from "../../../../utils/greetingHandler";
import apiClient from "../../../../api/axios";

export const Index = () => {
  const [loading, setLoading] = useState(false);
  const [centrales, setCentrales] = useState(null);

  useEffect(() => {
    const fetchCentrales = async () => {
      try {
        const response = await apiClient.get("/admin/config/central");
        if (response.data.success) {
          setCentrales(response.data.data);
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar configuración", "error");
      }
    };

    fetchCentrales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      value: centrales,
    };

    setLoading(true);

    try {
      const response = await apiClient.patch("/admin/config/central", data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al guardar configuración", "error");
    } finally {
      setLoading(false);
    }
  };

  const agregarFila = () => {
    setCentrales([...centrales, { amount: "", porcentaje: "" }]);
  };

  const eliminarFila = (index) => {
    const nuevos = [...centrales];
    nuevos.splice(index, 1);
    setCentrales(nuevos);
  };

  const handleChange = (index, campo, valor) => {
    // Permitir números con punto decimal (incluye casos incompletos como "123.")
    if (!/^\d*(\.?\d*)?$/.test(valor)) return;

    const nuevos = [...centrales];
    // Si termina en punto o está vacío, lo dejamos como string (evita romper la edición)
    if (campo === "amount" || campo === "porcentaje") {
      nuevos[index][campo] = valor.endsWith(".") || valor === "" ? valor : Number(valor);
    } else {
      nuevos[index][campo] = valor;
    }
    setCentrales(nuevos);
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Configuración de Centrales</h5>
          </div>
        </div>
        <div className="card-body">
          {centrales ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Monto</th>
                          <th></th>
                          <th>Porcentaje</th>
                          <th>Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {centrales.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="input-group input-group-merge">
                                <span className="input-group-text" id="text-to-speech-addon">
                                  Desde
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={item.amount}
                                  onChange={(e) => handleChange(index, "amount", e.target.value)}
                                  required
                                />
                                <span className="input-group-text" id="text-to-speech-addon">
                                  $
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="input-group-text justify-content-center">=</span>
                            </td>
                            <td>
                              <div className="input-group input-group-merge">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={item.porcentaje}
                                  onChange={(e) => handleChange(index, "porcentaje", e.target.value)}
                                  required
                                />
                                <span className="input-group-text" id="text-to-speech-addon">
                                  %
                                </span>
                              </div>
                            </td>
                            <td>
                              <button type="button" className="btn btn-danger" onClick={() => eliminarFila(index)}>
                                <i className="bx bx-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="text-center">
                        <tr>
                          <td colSpan="4">
                            <button type="button" className="btn btn-secondary w-100" onClick={agregarFila}>
                              <i className="bx bx-plus"></i>
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
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
                      "Enviar "
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
