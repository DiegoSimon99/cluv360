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
  const { updateText, updateImage } = useTemplateUpdater(setTemplate);

  useDynamicStyles("/assets/css/templates/happy-birthday.css", "happy-birthday-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/happyBirthday`);
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
        id: 139,
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
                  onBlur={(e) => updateText("cumpleanos-titulo", e.target.innerText)}
                >
                  {template["cumpleanos-titulo"]}
                </h1>
                <p
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("cumpleanos-subtitulo", e.target.innerText)}
                >
                  {template["cumpleanos-subtitulo"]}
                </p>
                <img src="https://apis.cluv360.com/mails/cumpleano/banner.png" className="banner" alt="Yala Logo" />
              </div>

              <div className="content">
                <p
                  className="hello"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("cumpleanos-text-1", e.target.innerText)}
                >
                  {template["cumpleanos-text-1"]}
                </p>
                <h1>Jhonatan Gomez Figueroa</h1>
                <img
                  src={template["cumpleanos-img-1"]}
                  alt="Imagen editable"
                  className="principal imagen-editable"
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById("cumpleanos-img-1").click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="cumpleanos-img-1"
                  name="nueva_imagen"
                  className="input-nueva-imagen"
                  style={{ display: "none" }}
                  onChange={(e) => updateImage("cumpleanos-img-1", e.target.files[0])}
                />
                <p
                  className="text"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("cumpleanos-text-2", e.target.innerText)}
                >
                  {template["cumpleanos-text-2"]}
                </p>
                <div className="image-content">
                  <a href="#">
                    <img
                      src={getYouTubeThumbnail(template["cumpleanos-link-1"])}
                      className="photo"
                      alt="Imagen de anuncio"
                      style={{ "border-radius": "8px", cursor: "pointer" }}
                      data-bs-toggle="modal"
                      data-bs-target="#modalButtonLink1"
                    />
                  </a>
                </div>
                <div style={{ "padding-top": "14px", "font-weight": "600", "font-size": "16px" }}>
                  <p
                    className="text"
                    style={{ "font-weight": "600", "font-size": "16px", "text-transform": "uppercase" }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("cumpleanos-text-3", e.target.innerText)}
                  >
                    {template["cumpleanos-text-3"]}
                  </p>{" "}
                  <p
                    className="text"
                    style={{ "font-weight": "600", "font-size": "16px", "text-transform": "uppercase" }}
                  >
                    20 🥳
                  </p>
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
                          {!template["cumpleanos-link-1"] ? (
                            <p className="text-center">Cargando enlace...</p>
                          ) : (
                            <label
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              onBlur={(e) => updateText("cumpleanos-link-1", e.target.innerText)}
                              style={{ width: "100%" }}
                            >
                              {template["cumpleanos-link-1"]}
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
