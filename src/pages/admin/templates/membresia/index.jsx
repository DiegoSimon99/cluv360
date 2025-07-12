import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import "./../../../../../public/assets/vendor/css/template-mail.css";
import { showNotification } from "../../../../utils/greetingHandler";
import { useTemplateUpdater } from "../../../../hooks/useTemplateUpdater";
import { useDynamicStyles } from "../../../../hooks/useDynamicStyles";
import TemplateFooter from "../../../../components/admin/TemplateFooter";
import { getYouTubeThumbnail } from "../../../../utils/getYouTubeThumbnail";

export const Index = () => {
  const [asunto, setAsunto] = useState(null);
  const [template, setTemplate] = useState(null);
  const { updateText } = useTemplateUpdater(setTemplate);

  useDynamicStyles("/assets/css/templates/membresia.css", "membresia-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/membresia`);
        setTemplate(response.data.data);
        setAsunto(response.data.data.asunto);
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar plantilla", "error");
      }
    };

    fetchTemplate();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setAsunto(value);
  };

  const handleBlur = async () => {
    try {
      const data = {
        id: 138,
        value: asunto,
      };
      const response = await apiClient.post("/admin/template/update_asunto", data);
      showNotification(response.data.message, "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Error al actualizar asunto", "error");
    }
  };

  return (
    <>
      {template ? (
        <>
          <div className="mb-4" style={{ "text-align": "-webkit-center" }}>
            <strong>Asunto</strong>
            <input
              type="text"
              onBlur={handleBlur}
              className="form-control w-50"
              onChange={handleChange}
              value={asunto}
            />
          </div>
          <div id="page-content">
            <div className="container">
              <div className="header">
                <img src="https://apis.cluv360.com/mails/logo_yala.png" className="logo" alt="Yala Logo" />
                <h1
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("membresia-titulo", e.target.innerText)}
                >
                  {template["membresia-titulo"]}
                </h1>
                <p
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("membresia-subtitulo", e.target.innerText)}
                >
                  {template["membresia-subtitulo"]}
                </p>
                <img src="https://apis.cluv360.com/mails/membresia/banner.png" className="banner" alt="Yala Logo" />
              </div>

              <div className="content">
                <p
                  className="hello"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("membresia-saludo", e.target.innerText)}
                >
                  {template["membresia-saludo"]}
                </p>
                <h1>Jhonatan Gomez Figueroa</h1>
                <p
                  className="text"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("membresia-text-1", e.target.innerText)}
                >
                  {template["membresia-text-1"]}
                </p>
                <div className="price">S/150.00</div>
                <p className="date">03 de Septiembre de 2024</p>
                <p
                  className="text"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("membresia-text-2", e.target.innerText)}
                >
                  {template["membresia-text-2"]}
                </p>
                <div className="image-content">
                  <img
                    src={getYouTubeThumbnail(template["membresia-link-1"])}
                    className="photo"
                    alt="Imagen de anuncio"
                    style={{ "border-radius": "8px", cursor: "pointer" }}
                    data-bs-toggle="modal"
                    data-bs-target="#modalButtonLink1"
                  />
                </div>
              </div>
              <TemplateFooter />
              <div className="modal fade" id="modalButtonLink1" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Editar Enlace</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <div className="row g-2">
                        <div className="col-12 mb-2">
                          {!template["membresia-link-1"] ? (
                            <p className="text-center">Cargando enlace...</p>
                          ) : (
                            <label
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              onBlur={(e) => updateText("membresia-link-1", e.target.innerText)}
                              style={{ width: "100%" }}
                            >
                              {template["membresia-link-1"]}
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p>Cargando Plantilla...</p>
        </div>
      )}
    </>
  );
};
