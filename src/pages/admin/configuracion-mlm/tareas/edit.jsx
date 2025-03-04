import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';

export const Edit = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        usuarios: 0,
        title: "",
        message: "",
        minute: "*",
        hour: "*",
        day: "*",
        month: "*",
        day_business: "*"
    });

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        apiClient.get(`/admin/config/tareas/edit/${id}`)
            .then(response => {
                if (response.data.success) {
                    const data = response.data.data;
                    setFormData({
                        name: data.name || "",
                        usuarios: data.usuarios || 0,
                        title: data.title || "",
                        message: data.message || "",
                        minute: data.minute || "*",
                        hour: data.hour || "*",
                        day: data.day || "*",
                        month: data.month || "*",
                        day_business: data.day_business || "*",
                    });
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al obtener tarea", 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        apiClient.patch(`/admin/config/tareas/${id}`, formData)
            .then(response => {
                if (response.data.success) {
                    showNotification(response.data.message, 'success');
                    navigate('/admin/config/cron-job-settings');
                } else {
                    showNotification(response.data.message, 'error');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al actualizar tarea", 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información de tarea</h5>
                    </div>
                </div>
                <div className="card-body">
                    {!isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Nombre de la tarea</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Usuarios a notificar</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        name="usuarios"
                                        value={formData.usuarios}
                                        onChange={handleChange}
                                        required>
                                        <option value="0">Todos</option>
                                        <option value="6">Usuarios Gratis</option>
                                        <option value="2">Usuarios Embajadores</option>
                                        <option value="1">Usuarios Premium</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Título Notificación</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Mensaje Notificación</label>
                                <div className="col-sm-10">
                                    <textarea
                                        name="message"
                                        className='form-control'
                                        onChange={handleChange}
                                        required>
                                        {formData.message}
                                    </textarea>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Minuto</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        name="minute"
                                        value={formData.minute}
                                        onChange={handleChange}>
                                        <option value="*">Seleccionar</option>
                                        <option value="*">Una vez por minuto (*)</option>
                                        <option value="*/2">Una vez cada dos minutos (*)/2)</option>
                                        <option value="*/10">Una vez cada diez minutos (*)/10)</option>
                                        <option value="*/15">Una vez cada quince minutos (*/15)</option>
                                        <option value="0,30">Una vez cada treinta minutos (0,30)</option>
                                        <option value="0">:00 (0)</option>
                                        <option value="1">:01 (1)</option>
                                        <option value="2">:02 (2)</option>
                                        <option value="3">:03 (3)</option>
                                        <option value="4">:04 (4)</option>
                                        <option value="5">:05 (5)</option>
                                        <option value="6">:06 (6)</option>
                                        <option value="7">:07 (7)</option>
                                        <option value="8">:08 (8)</option>
                                        <option value="9">:09 (9)</option>
                                        {Array.from({ length: 50 }, (_, i) => i + 10).map(num => (
                                            <option key={num} value={num}>:{num} ({num})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Hora</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        name="hour"
                                        value={formData.hour}
                                        onChange={handleChange}>
                                        <option value="*">Seleccionar</option>
                                        <option value="*">Cada hora (*)</option>
                                        <option value="*/2">Cada dos horas (*/2)</option>
                                        <option value="*/3">Cada tercera hora (*/3)</option>
                                        <option value="*/4">Cada cuarta hora (*/4)</option>
                                        <option value="*/6">Cada sexta hora (*/6)</option>
                                        <option value="0">12:00 am Medianoche (0)</option>
                                        <option value="1">1:00 am (1)</option>
                                        <option value="2">2:00 am (2)</option>
                                        <option value="3">3:00 am (3)</option>
                                        <option value="4">4:00 am (4)</option>
                                        <option value="5">5:00 am (5)</option>
                                        <option value="6">6:00 am (6)</option>
                                        <option value="7">7:00 am (7)</option>
                                        <option value="8">8:00 am (8)</option>
                                        <option value="9">9:00 am (9)</option>
                                        <option value="10">10:00 am (10)</option>
                                        <option value="11">11:00 am (11)</option>
                                        <option value="12">12:00 pm Mediodía (12)</option>
                                        <option value="13">1:00 p.m. (13)</option>
                                        <option value="14">2:00 p.m. (14)</option>
                                        <option value="15">3:00 p.m. (15)</option>
                                        <option value="16">4:00 p.m. (16)</option>
                                        <option value="17">5:00 p.m. (17)</option>
                                        <option value="18">6:00 p.m. (18)</option>
                                        <option value="19">7:00 p.m. (19)</option>
                                        <option value="20">8:00 p.m. (20)</option>
                                        <option value="21">9:00 p.m. (21)</option>
                                        <option value="22">10:00 p.m. (22)</option>
                                        <option value="23">11:00 p.m. (23)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label">Día</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        name="day"
                                        value={formData.day}
                                        onChange={handleChange}>
                                        <option value="*">Seleccionar</option>
                                        <option value="*">Cada día (*)</option>
                                        <option value="*/2">Cada dos días (*/2)</option>
                                        <option value="1,15">Los días 1 y 15 del mes (1,15)</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num} ({num})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <label className="col-sm-2 col-form-label">Mes</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        name="month"
                                        value={formData.month}
                                        onChange={handleChange}>
                                        <option value="*">Seleccionar</option>
                                        <option value="*">Cada mes (*)</option>
                                        <option value="*/2">Cada dos meses (*/2)</option>
                                        <option value="*/4">Cada tercer mes (*/4)</option>
                                        <option value="1,7">Cada seis meses (1,7)</option>
                                        <option value="1">Enero (1)</option>
                                        <option value="2">Febrero (2)</option>
                                        <option value="3">Marzo (3)</option>
                                        <option value="4">Abril (4)</option>
                                        <option value="5">Mayo (5)</option>
                                        <option value="6">Junio (6)</option>
                                        <option value="7">Julio (7)</option>
                                        <option value="8">Agosto (8)</option>
                                        <option value="9">Setiembre (9)</option>
                                        <option value="10">Octubre (10)</option>
                                        <option value="11">Noviembre (11)</option>
                                        <option value="12">Diciembre (12)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <label className="col-sm-2 col-form-label">Día laborable</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        name="day_business"
                                        value={formData.day_business}
                                        onChange={handleChange}>
                                        <option value="*">Seleccionar</option>
                                        <option value="*">Cada día (*)</option>
                                        <option value="1-5">Todos los días de lunes a viernes (1-5)</option>
                                        <option value="0,6">Sábado y Domingo (0,6)</option>
                                        <option value="1,3,5">Todos los lunes, miércoles y viernes (1,3,5)</option>
                                        <option value="2,4">Todos los martes y jueves (2,4)</option>
                                        <option value="0">Domingo (0)</option>
                                        <option value="1">Lunes (1)</option>
                                        <option value="2">Martes (2)</option>
                                        <option value="3">Miércoles (3)</option>
                                        <option value="4">Jueves (4)</option>
                                        <option value="5">Viernes (5)</option>
                                        <option value="6">Sábado (6)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-sm-10 text-end">
                                    <button aria-label='Click me' type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            "Guardar"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className='text-center'>
                            <p>Cargando Información...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}