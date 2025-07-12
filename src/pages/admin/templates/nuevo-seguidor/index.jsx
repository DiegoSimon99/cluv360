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
  const { updateText } = useTemplateUpdater(setTemplate);

  useDynamicStyles("/assets/css/templates/nuevo-seguidor.css", "nuevo-seguidor-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/seguidor`);
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
        id: 137,
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
                  onBlur={(e) => updateText("seguidor-titulo", e.target.innerText)}
                >
                  {template["seguidor-titulo"]}
                </h1>
                <p
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("seguidor-subtitulo", e.target.innerText)}
                >
                  {template["seguidor-subtitulo"]}
                </p>
                <img src="https://apis.cluv360.com/mails/seguidor/banner.png" className="banner" alt="Yala Logo" />
              </div>
              <div className="content">
                <p
                  className="hello"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("seguidor-saludo", e.target.innerText)}
                >
                  {template["seguidor-saludo"]}
                </p>
                <h1>Jhonatan Gomez Figueroa</h1>
                <p
                  className="text"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("seguidor-text-1", e.target.innerText)}
                >
                  {template["seguidor-text-1"]}
                </p>
                <div className="content-comision">
                  <img src="https://apis.cluv360.com/mails/seguidor/avatar.png" />
                  <p className="user">Raul Flores</p>
                  <p className="ocupacion">Contador</p>
                  <ul>
                    <li>230 seguidores</li>
                    <li>4.9K seguidos</li>
                    <li>23K likes</li>
                  </ul>
                  <a href="#">
                    <span>Ver perfil</span>
                  </a>
                </div>
              </div>
              <h1
                className="title"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("seguidor-text-2", e.target.innerText)}
              >
                {template["seguidor-text-2"]}
              </h1>
              <ul className="profiles">
                <li>
                  <div></div>
                  <img src="https://apis.cluv360.com/mails/seguidor/user1.png" />
                  <h1>Flavio Gonzales</h1>
                  <p>2 perfiles en común</p>
                </li>
                <li>
                  <img src="https://apis.cluv360.com/mails/seguidor/user2.png" />
                  <h1>Romina Díaz</h1>
                  <p>2 perfiles en común</p>
                </li>
                <li>
                  <img src="https://apis.cluv360.com/mails/seguidor/user3.png" />
                  <h1>Saraí Dominguez</h1>
                  <p>6 perfiles en común</p>
                </li>
                <li>
                  <img src="https://apis.cluv360.com/mails/seguidor/user4.png" />
                  <h1>Fernando La Torre</h1>
                  <p>4 perfiles en común</p>
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
