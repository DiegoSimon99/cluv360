import { useCallback } from "react";
import apiClient from "../api/axios";
import { showNotification } from "../utils/greetingHandler";

export const useTemplateUpdater = (setTemplate) => {
  const updateText = useCallback(
    async (name, value) => {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("value", value);
        formData.append("file", 0);

        const response = await apiClient.post("/admin/template/update", formData);
        if (response.data.success) {
          showNotification(response.data.message, "success");
          setTemplate((prev) => ({ ...prev, [name]: response.data.data }));
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification("Error al actualizar el texto", "error");
      }
    },
    [setTemplate]
  );

  const updateImage = useCallback(
    async (name, file) => {
      const localUrl = URL.createObjectURL(file);
      setTemplate((prev) => ({ ...prev, [name]: localUrl }));
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("value", file);
        formData.append("file", 1);

        const response = await apiClient.post("/admin/template/update", formData);
        if (response.data.success) {
          showNotification(response.data.message, "success");
          setTemplate((prev) => ({ ...prev, [name]: response.data.data }));
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification("Error al actualizar la imagen", "error");
      }
    },
    [setTemplate]
  );

  return {
    updateText,
    updateImage,
  };
};
