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

  useDynamicStyles("/assets/css/templates/bienvenida.css", "bienvenida-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/bienvenida`);
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
        id: 131,
        value: asunto,
      };
      const response = await apiClient.post("/admin/template/update_asunto", data);
      showNotification(response.data.message,'success');
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
                  onBlur={(e) => updateText("bienvenida-titulo", e.target.innerText)}
                >
                  {template["bienvenida-titulo"]}
                </h1>
                <p
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("bienvenida-mensaje", e.target.innerText)}
                >
                  {template["bienvenida-mensaje"]}
                </p>
                <img src="https://apis.cluv360.com/mails/bienvenida/banner.png" className="banner" alt="Yala Logo" />
              </div>

              <div className="content">
                <p
                  className="hello"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("bienvenida-hola", e.target.innerText)}
                >
                  {template["bienvenida-hola"]}
                </p>
                <h1>Jhonatan Gomez Figueroa</h1>
                <p
                  className="text"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("bienvenida-info-user", e.target.innerText)}
                >
                  {template["bienvenida-info-user"]}
                </p>
                <ul className="info">
                  <li className="codigo">
                    <p
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateText("bienvenida-info-1", e.target.innerText)}
                    >
                      {template["bienvenida-info-1"]}
                    </p>
                    <h1>309MP912</h1>
                  </li>
                  <li className="phone">
                    <p
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateText("bienvenida-info-2", e.target.innerText)}
                    >
                      {template["bienvenida-info-2"]}
                    </p>
                    <h1>+999223102</h1>
                  </li>
                  <li className="email">
                    <p
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateText("bienvenida-info-3", e.target.innerText)}
                    >
                      {template["bienvenida-info-3"]}
                    </p>
                    <h1>yala123*</h1>
                  </li>
                </ul>
              </div>
              <h1
                className="title"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("bienvenida-title", e.target.innerText)}
              >
                {template["bienvenida-title"]}
              </h1>
              <ul>
                <li>
                  <img
                    src={template["bienvenida-img-1"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("bienvenida-img-1").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="bienvenida-img-1"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("bienvenida-img-1", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("bienvenida-social-1", e.target.innerText)}
                  >
                    {template["bienvenida-social-1"]}
                  </p>
                </li>
                <li>
                  <img
                    src={template["bienvenida-img-2"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("bienvenida-img-2").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="bienvenida-img-2"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("bienvenida-img-2", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("bienvenida-social-2", e.target.innerText)}
                  >
                    {template["bienvenida-social-2"]}
                  </p>
                </li>
                <li>
                  <img
                    src={template["bienvenida-img-3"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("bienvenida-img-3").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="bienvenida-img-3"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("bienvenida-img-3", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("bienvenida-social-3", e.target.innerText)}
                  >
                    {template["bienvenida-social-3"]}
                  </p>
                </li>
                <li>
                  <img
                    src={template["bienvenida-img-4"]}
                    alt="Imagen editable"
                    className="imagen-editable"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("bienvenida-img-4").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="bienvenida-img-4"
                    name="nueva_imagen"
                    className="input-nueva-imagen"
                    style={{ display: "none" }}
                    onChange={(e) => updateImage("bienvenida-img-4", e.target.files[0])}
                  />
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("bienvenida-social-4", e.target.innerText)}
                  >
                    {template["bienvenida-social-4"]}
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
