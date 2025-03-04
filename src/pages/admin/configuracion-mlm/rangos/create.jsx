import { useEffect, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../../../utils/greetingHandler';
import apiClient from '../../../../api/axios';

export const Create = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        directos: "",
        pts_personales: "",
        puntos: "",
        monto_premio: "",
        habilitar: "",
        nivel_rango: "",
        descripcion: "",
    });

    const [file, setFile] = useState(null);
    const [rangos, setRangos] = useState([]);
    const [bonos, setBonos] = useState([]);
    const [selectRango, setSelectRango] = useState([]);
    const navigate = useNavigate();

    const selectBono = [
        { "id": 1, "nombre": "Bono Auto" },
        { "id": 2, "nombre": "Bono Depa" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/admin/config/rangos/lista-rango');
                setSelectRango(response.data);
            } catch (error) {
                showNotification("Error al listar rangos", 'error');
            }
        };

        fetchData();
    }, []);

    const onDrop = (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));

        if (filteredFiles.length === 0) {
            showNotification("El archivo no es una imagen y fue descartado.", "error");
            return;
        }

        // Solo permitir una imagen (tomar la primera)
        const selectedFile = filteredFiles[0];
        setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [] // Aceptar solo imágenes
        },
        multiple: true, // Permitir múltiples archivos
    });

    const removeFile = () => {
        setFile(null);
    };

    const handleSubmitRango = async (e) => {
        e.preventDefault();

        if (!file) {
            showNotification("Es obligatorio subir una imagen.", "error");
            return;
        }

        const data = new FormData();

        data.append("photo", file);
        data.append("rangos", JSON.stringify(rangos));
        data.append("bonos", JSON.stringify(bonos));

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                data.append(key, value[0]);
            } else {
                data.append(key, value);
            }
        });

        setLoading(true);
        apiClient.post(`/admin/config/rangos/store`, data)
            .then(response => {
                response.data.message.forEach(item => {
                    showNotification(item.message, item.type);
                })
                if (response.data.success) {
                    navigate('/admin/config/rangos/');
                }
            })
            .catch((error) => {
                showNotification(error.response?.data?.message || "Error al guardar rango", 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleChangeRango = (e) => {
        const { name, value } = e.target;
        if (name === "pts_personales" || name === "puntos" || name === "monto_premio") {
            if (/^\d*\.?\d*$/.test(value)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Agregar una nueva fila
    const agregarFilaRango = () => {
        setRangos([...rangos, { id: "", cantidad: "" }]);
    };

    // Eliminar una fila
    const eliminarFilaRango = (index) => {
        const nuevosRangos = [...rangos];
        nuevosRangos.splice(index, 1);
        setRangos(nuevosRangos);
    };

    // Manejar cambios en los select e inputs
    const handleChangeRangoList = (index, campo, valor) => {
        const nuevosRangos = [...rangos];
        nuevosRangos[index][campo] = valor;
        setRangos(nuevosRangos);
    };

    // Agregar una nueva fila
    const agregarFilaBono = () => {
        setBonos([...bonos, { id: "", monto: "" }]);
    };

    // Eliminar una fila
    const eliminarFilaBono = (index) => {
        const nuevosBonos = [...bonos];
        nuevosBonos.splice(index, 1);
        setBonos(nuevosBonos);
    };

    // Manejar cambios en los select e inputs
    const handleChangeBonoList = (index, campo, valor) => {
        if (campo === "monto") {
            // Permitir solo números y un punto decimal
            if (!/^\d*\.?\d*$/.test(valor)) {
                return;
            }
        }

        const nuevosBonos = [...bonos];
        nuevosBonos[index][campo] = valor;
        setBonos(nuevosBonos);
    };

    return (
        <>
            <div className="card">
                <div className="card-header align-items-center row">
                    <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
                        <h5 className="mb-0 text-md-start text-center">Información de rango</h5>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitRango}>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Foto</label>
                            <div className="col-sm-10">
                                {!file && (
                                    <div {...getRootProps()}
                                        style={{
                                            border: "2px dashed #cccccc",
                                            padding: "20px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}>
                                        <input {...getInputProps()} />
                                        <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
                                    </div>
                                )}
                                {file && (
                                    <div className="preview-container" style={{ display: "flex", flexWrap: "wrap" }}>
                                        <div key={file.name} style={{ position: "relative" }}>
                                            <img
                                                src={file.preview}
                                                alt="preview"
                                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                            />
                                            <button
                                                className="btn btn-danger btn-xs"
                                                style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px" }}
                                                onClick={removeFile}>
                                                <i className="bx bx-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Nombre</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Frase</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Puntos personales</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pts_personales"
                                    value={formData.pts_personales}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Puntos de calificación</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="puntos"
                                    value={formData.puntos}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Líneas activas</label>
                            <div className="col-sm-10">
                                <input
                                    type="number"
                                    className="form-control"
                                    name="directos"
                                    value={formData.directos}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Monto Premio</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className='form-control'
                                    name="monto_premio"
                                    value={formData.monto_premio}
                                    onChange={handleChangeRango}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Habilitar Niveles</label>
                            <div className="col-sm-10">
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    name="habilitar"
                                    value={formData.habilitar}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <label className="col-sm-2 col-form-label">Orden de rango</label>
                            <div className="col-sm-10">
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    name="nivel_rango"
                                    value={formData.nivel_rango}
                                    onChange={handleChangeRango}
                                    required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className='table table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Rango Activo</th>
                                                <th>Cantidad</th>
                                                <th>Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rangos.map((rango, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select
                                                            className="form-select"
                                                            value={rango.id}
                                                            onChange={(e) => handleChangeRangoList(index, "id", e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Seleccione</option>
                                                            {selectRango.map((opcion) => (
                                                                <option key={opcion.id} value={opcion.id}>
                                                                    {opcion.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={rango.cantidad}
                                                            onChange={(e) => handleChangeRangoList(index, "cantidad", e.target.value)}
                                                            min="1"
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <button type="button" className="btn btn-danger" onClick={() => eliminarFilaRango(index)}>
                                                            <i className="bx bx-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="text-center">
                                            <tr>
                                                <td colSpan="3">
                                                    <button type="button" className="btn btn-secondary w-100" onClick={agregarFilaRango}>
                                                        <i className="bx bx-plus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className='table table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Nombre Bono</th>
                                                <th>Monto</th>
                                                <th>Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bonos.map((bono, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select
                                                            className="form-select"
                                                            value={bono.id}
                                                            onChange={(e) => handleChangeBonoList(index, "id", e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Seleccione</option>
                                                            {selectBono.map((opcion) => (
                                                                <option key={opcion.id} value={opcion.id}>
                                                                    {opcion.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={bono.monto}
                                                            onChange={(e) => handleChangeBonoList(index, "monto", e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <button type="button" className="btn btn-danger" onClick={() => eliminarFilaBono(index)}>
                                                            <i className="bx bx-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="text-center">
                                            <tr>
                                                <td colSpan="3">
                                                    <button type="button" className="btn btn-secondary w-100" onClick={agregarFilaBono}>
                                                        <i className="bx bx-plus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
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
                                        "Enviar "
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}