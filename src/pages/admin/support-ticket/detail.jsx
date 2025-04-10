import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showNotification } from "../../../utils/greetingHandler";
import apiClient from "../../../api/axios";
import { formatDate } from "../../../utils/dateFormatter";
import { useAdmin } from "../../../layouts/contexts/AdminContext";
import { confirmAlert } from "react-confirm-alert";
import ReactQuill from "react-quill";

export const Detail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const { setRefreshTicketsCount } = useAdmin();
  const [formData, setFormData] = useState({
    reply: "",
    status: null,
  });
  const statusTicket = [
    {
      value: "pending",
      name: "Pendiente",
    },
    {
      value: "Open",
      name: "Abierto",
    },
    {
      value: "solved",
      name: "Resuelto",
    },
  ];

  useEffect(() => {
    showTicket();
  }, []);

  const showTicket = async () => {
    setTicket(null);
    try {
      const response = await apiClient.get(`/admin/support_ticket/show/${id}`);
      if (response.data.success) {
        setTicket(response.data.data);
        setRefreshTicketsCount((prev) => !prev);
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al consultar pedido", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.reply) {
      showNotification("El campo respuesta es obligatorio", "error");
      return;
    }

    confirmAlert({
      title: "Confirmar respuesta",
      message: "¿Estás seguro que deseas enviar y actualizar el estado del ticket?",
      buttons: [
        {
          label: "Sí, actualizar",
          onClick: async () => {
            try {
              setIsLoading(true);
              const response = await apiClient.post(`/admin/support_ticket/reply/${ticket.id}`, formData);
              if (response.data.success) {
                showTicket();
                setFormData({
                  reply: "",
                  status: null,
                });
                showNotification(response.data.message, "success");
              } else {
                showNotification(response.data.message, "error");
              }
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al actualizar estado del ticket", "error");
            } finally {
              setIsLoading(false);
            }
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
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
      reply: value,
    }));
  };

  return (
    <>
      {ticket ? (
        <div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 row-gap-4">
            <div className="d-flex flex-column justify-content-center">
              <div className="mb-1">
                <span className="h5">{ticket.subject + " #" + ticket.code} </span>
                {ticket.status == "pending" ? (
                  <span className="badge rounded-pill bg-label-danger">{ticket.status}</span>
                ) : ticket.status == "open" ? (
                  <span className="badge rounded-pill bg-label-secondary">{ticket.status}</span>
                ) : (
                  <span className="badge rounded-pill bg-label-success">{ticket.status}</span>
                )}
              </div>
              <p className="mb-0">{formatDate(ticket.created_at)}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-4">
              <form onSubmit={handleSubmit}>
                <div className="card p-4">
                  <div className="form-group mb-4">
                    <label className="form-label">Respuesta</label>
                    <ReactQuill
                      value={formData.reply}
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
                  <div className="form-group mb-4">
                    <label className="form-label">Estado</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {statusTicket.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group text-end">
                    <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading && (
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
            <div className="col-12">
              {ticket.ticketReplies.map((item) => (
                <div key={item.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-start align-items-center mb-4">
                      <div className="avatar me-3">
                        <img
                          src={item.avatar_original || import.meta.env.VITE_URL_PRODUCTO}
                          alt="Avatar"
                          className="rounded-circle"
                        />
                      </div>
                      <div className="d-flex flex-column">
                        <a href="app-user-view-account.html" className="text-body text-nowrap">
                          <h6 className="mb-0">{item.user}</h6>
                        </a>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: item.reply }} />
                  </div>
                </div>
              ))}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-start align-items-center mb-4">
                    <div className="avatar me-3">
                      <img
                        src={ticket.avatar_original || import.meta.env.VITE_URL_PRODUCTO}
                        alt="Avatar"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="d-flex flex-column">
                      <a href="app-user-view-account.html" className="text-body text-nowrap">
                        <h6 className="mb-0">{ticket.user}</h6>
                      </a>
                      <span>{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: ticket.details }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Cargando Información...</p>
        </div>
      )}
    </>
  );
};
