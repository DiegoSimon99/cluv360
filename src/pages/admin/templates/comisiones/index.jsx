import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import "./../../../../../public/assets/vendor/css/template-mail.css";
import { showNotification } from "../../../../utils/greetingHandler";
import { useDynamicStyles } from "../../../../hooks/useDynamicStyles";
import { useTemplateUpdater } from "../../../../hooks/useTemplateUpdater";
import TemplateFooter from "../../../../components/admin/TemplateFooter";

export const Index = () => {
  const [template, setTemplate] = useState(null);
  const { updateText } = useTemplateUpdater(setTemplate);

  useDynamicStyles("/assets/css/templates/comisiones.css", "comisiones-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/comisiones`);
        setTemplate(response.data.data);
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar plantilla", "error");
      }
    };

    fetchTemplate();
  }, []);

  return (
    <>
      {template ? (
        <div id="page-content">
          <div className="container">
            <div className="header">
              <img src="https://apis.cluv360.com/mails/logo_yala.png" className="logo" alt="Yala Logo" />
              <h1
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("transferencia-titulo", e.target.innerText)}
              >
                {template["transferencia-titulo"]}
              </h1>
              <p
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("transferencia-subtitulo", e.target.innerText)}
              >
                {template["transferencia-subtitulo"]}
              </p>
              <img src="https://apis.cluv360.com/mails/movimiento/banner.png" className="banner" alt="Yala Logo" />
            </div>

            <div className="content">
              <p
                className="hello"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("transferencia-saludo", e.target.innerText)}
              >
                {template["transferencia-saludo"]}
              </p>
              <h1>Jhonatan Gomez Figueroa</h1>
              <p className="text">Ganaste</p>
              <div className="price">$4.98</div>
              <p className="date">03 de Septiembre de 2024</p>
              <p className="text" style={{ "font-weight": "bold", "font-size": "18px" }}>
                Concepto de comisión:
              </p>
              <div className="content-comision">
                <p
                  className="title"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateText("transferencia-afiliacion", e.target.innerText)}
                >
                  {template["transferencia-afiliacion"]}
                </p>
                <img src="https://cluv360.com/public/frontend/images/user.png" />
                <p className="user">Enrique Silva</p>
              </div>
            </div>
            <TemplateFooter />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Cargando Plantilla...</p>
        </div>
      )}
    </>
  );
};
