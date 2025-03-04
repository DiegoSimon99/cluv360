// greetingHandler.js
import { toast } from "react-toastify";

export const showNotification = (message, type) => {
    toast(message, { type: type }); // Puede ser "success", "error", "info", "warning"
};

export const getGreetingMessage = (name) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting;

    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Buen día 😎';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Buenas tardes 🌤️';
    } else {
        greeting = 'Buenas noches 🌙';
    }

    return `👋 Hola ${name}, ${greeting}!`;
};

export default getGreetingMessage;
