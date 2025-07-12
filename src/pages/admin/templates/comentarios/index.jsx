import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import "./../../../../../public/assets/vendor/css/template-mail.css";
import { showNotification } from "../../../../utils/greetingHandler";
import { useTemplateUpdater } from "../../../../hooks/useTemplateUpdater";
import { useDynamicStyles } from "../../../../hooks/useDynamicStyles";
import TemplateFooter from "../../../../components/admin/TemplateFooter";

export const Index = () => {
  const [asunto, setAsunto] = useState(null);
  const [template, setTemplate] = useState(null);
  const { updateText, updateImage } = useTemplateUpdater(setTemplate);

  useDynamicStyles("/assets/css/templates/comentarios.css", "comentarios-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/comentarios`);
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
        id: 135,
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
                  onBlur={(e) => updateText("comentario-titulo", e.target.innerText)}
                >
                  {template["comentario-titulo"]}
                </h1>
                <p
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("comentario-subtitulo", e.target.innerText)}
                >
                  {template["comentario-subtitulo"]}
                </p>
                <img src="https://apis.cluv360.com/mails/comentario/banner.png" className="banner" alt="Yala Logo" />
              </div>
              <div className="content">
                <p
                  className="hello"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("comentario-saludo", e.target.innerText)}
                >
                  {template["comentario-saludo"]}
                </p>
                <h1>Jhonatan Gomez Figueroa</h1>
                <p
                  className="text"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("comentario-text", e.target.innerText)}
                >
                  {template["comentario-text"]}
                </p>
                <div className="content-comision">
                  <img src="https://cluv360.com/public/frontend/images/user.png" />
                  <p className="user">Paula Rivas</p>
                  <p className="comentario">
                    “ Me encanta ese lugar yo he ido una vez con mis amigas y es cierto, es mágico”
                  </p>
                </div>
              </div>
              <h1
                className="title"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("comentario-descripcion", e.target.innerText)}
              >
                {template["comentario-descripcion"]}
              </h1>
              <ul>
                <li>
                  <img
                    src={template["comentario-img-1"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("comentario-img-1").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="comentario-img-1"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("comentario-img-1", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("comentario-item-1", e.target.innerText)}
                  >
                    {template["comentario-item-1"]}
                  </p>
                </li>
                <li>
                  <img
                    src={template["comentario-img-2"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("comentario-img-2").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="comentario-img-2"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("comentario-img-2", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("comentario-item-2", e.target.innerText)}
                  >
                    {template["comentario-item-2"]}
                  </p>
                </li>
                <li>
                  <img
                    src={template["comentario-img-3"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("comentario-img-3").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="comentario-img-3"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("comentario-img-3", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("comentario-item-3", e.target.innerText)}
                  >
                    {template["comentario-item-3"]}
                  </p>
                </li>
                <li>
                  <img
                    src={template["comentario-img-4"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("comentario-img-4").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="comentario-img-4"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("comentario-img-4", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("comentario-item-4", e.target.innerText)}
                  >
                    {template["comentario-item-4"]}
                  </p>
                </li>
              </ul>
              <TemplateFooter />
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
