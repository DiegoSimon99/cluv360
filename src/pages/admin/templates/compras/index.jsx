import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import "./../../../../../public/assets/vendor/css/template-mail.css";
import { showNotification } from "../../../../utils/greetingHandler";
import { useTemplateUpdater } from "../../../../hooks/useTemplateUpdater";
import { useDynamicStyles } from "../../../../hooks/useDynamicStyles";
import TemplateFooter from "../../../../components/admin/TemplateFooter";

export const Index = () => {
  const [template, setTemplate] = useState(null);
  const { updateText } = useTemplateUpdater(setTemplate);

  useDynamicStyles("/assets/css/templates/compras.css", "compras-styles");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await apiClient.get(`/admin/template/compras`);
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
                onBlur={(e) => updateText("compras-titulo", e.target.innerText)}
              >
                {template["compras-titulo"]}
              </h1>
              <img src="https://apis.cluv360.com/mails/compras/banner.png" className="banner" alt="Yala Logo" />
            </div>

            <div className="content">
              <p
                className="hello"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("compras-hola", e.target.innerText)}
              >
                {template["compras-hola"]}
              </p>
              <h1>Jhonatan Gomez Figueroa</h1>
              <p
                className="text"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => updateText("compras-subtitulo", e.target.innerText)}
              >
                {template["compras-subtitulo"]}
              </p>
              <div className="info">
                <div className="image">
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("compras-item1-titulo", e.target.innerText)}
                  >
                    {template["compras-item1-titulo"]}
                  </p>
                  <img src="https://apis.cluv360.com/mails/compras/seller.png" />
                  <h1>BURGER MANIA</h1>
                </div>
                <div className="amount">
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("compras-item2-titulo", e.target.innerText)}
                  >
                    {template["compras-item2-titulo"]}
                  </p>
                  <h1>S/34.00</h1>
                  <h2>3 productos</h2>
                </div>
                <div className="date">
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("compras-item3-titulo", e.target.innerText)}
                  >
                    {template["compras-item3-titulo"]}
                  </p>
                  <div>
                    <p>Martes</p>
                    <h1>03</h1>
                    <p>Septiembre 2024</p>
                  </div>
                </div>
              </div>
            </div>
            <h1
              className="title"
              contentEditable="true"
              suppressContentEditableWarning={true}
              onBlur={(e) => updateText("compras-titulo-dinero", e.target.innerText)}
            >
              {template["compras-titulo-dinero"]}
            </h1>
            <div className="ganancia">
              <div>
                <h1>
                  13{" "}
                  <p
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateText("compras-puntos", e.target.innerText)}
                  >
                    {template["compras-puntos"]}
                  </p>
                </h1>
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
