// src/utils/dateFormatter.js
import { format } from 'date-fns';

export const formatDate = (dateString) => {
    if (!dateString) return "-"; // Si no hay fecha, devuelve "-"
    return format(new Date(dateString), "dd/MM/yyyy hh:mm a");
};