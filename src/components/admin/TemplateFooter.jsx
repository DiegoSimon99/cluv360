import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { showNotification } from "../../utils/greetingHandler";

const TemplateFooter = () => {
  const [dataFooter, setDataFooter] = useState(null);
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await apiClient.post(`/admin/template/show`, { name: "link-1" });
        setDataFooter(response.data.data);
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar plantilla", "error");
      }
    };
    fetchFooter();
  }, []);

  const updateText = async (name,value) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("value", value);
      formData.append("file", 0);

      const response = await apiClient.post("/admin/template/update", formData);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        setDataFooter(response.data.data);
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification("Error al actualizar el texto", "error");
    }
  };

  return (
    <div>
      <div className="footer">
        <button type="button" className="btn button" data-bs-toggle="modal" data-bs-target="#modalButtonYala">
          <span>Ir a Yala</span>
        </button>
        <p>Síguenos</p>
        <a href="#">
          <img src="https://apis.cluv360.com/mails/instagram.png" alt="Instagram" />
        </a>
        <a href="#">
          <img src="https://apis.cluv360.com/mails/facebook.png" alt="Facebook" />
        </a>
        <a href="#">
          <img src="https://apis.cluv360.com/mails/tiktok.png" alt="TikTok" />
        </a>
      </div>
      <div className="modal fade" id="modalButtonYala" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Enlace</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-2">
                <div className="col-12 mb-2">
                  {!dataFooter ? (
                    <p className="text-center">Cargando enlace...</p>
                  ) : (
                    <label
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateText("link-1", e.target.innerText)}
                      style={{ width: "100%" }}
                    >
                      {dataFooter}
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFooter;
