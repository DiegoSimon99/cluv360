import apiClient from "../api/axios";

const fetchUserData = async () => {
    try {
        console.log("Intentando obtener datos del usuario...");
        const response = await apiClient.get("/user");
        console.log("Datos del usuario obtenidos:", response.data.user);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        return response.data.user;
    } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        return null;
    }
};

export default fetchUserData;