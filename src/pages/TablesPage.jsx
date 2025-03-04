import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const TablesPage = () => {
    const [data, setData] = useState([]);  // Almacena los datos de la API
    const [loading, setLoading] = useState(true);  // Estado de carga
    const [error, setError] = useState(null);  // Estado de error
    const [responseMessage, setResponseMessage] = useState(null); // Estado para el mensaje de respuesta

    const [num1, setNum1] = useState(''); // Estado para el primer número
    const [num2, setNum2] = useState(''); // Estado para el segundo número
    const [total, setTotal] = useState(null);

    // Realizar la solicitud a la API cuando el componente se monta
    useEffect(() => {
        axios.get('https://pre.cluv360.com/api/lista_moneda/10331')
            .then(response => {
                setData(response.data.data);  // Almacenar los datos obtenidos
                setLoading(false);  // Detener el estado de carga
            })
            .catch(error => {
                setError(error);  // Si ocurre un error
                setLoading(false);  // Detener el estado de carga
            });
    }, []);  // El arreglo vacío asegura que esto solo se ejecute una vez

    if (loading) {
        return <div>Loading...</div>;  // Mostrar un mensaje de carga
    }

    if (error) {
        return <div>Error: {error.message}</div>;  // Mostrar el error si ocurre
    }


    // Hacer la solicitud POST
    const handlePostRequest = async () => {
        const postData = {
            user_id: 10539,
            movimiento_id: 29756,
        };

        try {
            const response = await axios.post('https://pre.cluv360.com/api/comprobante', postData, {
                headers: {
                    'Content-Type': 'application/json',  // Asegúrate de enviar los datos como JSON
                },
            });

            // Si la respuesta es exitosa, mostramos el mensaje
            setResponseMessage(`Respuesta exitosa: ${JSON.stringify(response.data)}`);
            // Si deseas actualizar los datos en la tabla, puedes hacerlo aquí
            // setData(response.data); // Descomenta si la respuesta contiene datos que quieres mostrar en la tabla

        } catch (error) {
            // Si hay un error en la solicitud
            setResponseMessage(`Error: ${error.message}`);
        }
    };


    // Función para manejar la suma
    const handleSum = () => {
        // Convertir las entradas a números
        const number1 = parseFloat(num1);
        const number2 = parseFloat(num2);

        // Verificar si ambas entradas son números válidos
        if (!isNaN(number1) && !isNaN(number2)) {
            // Sumar los dos números y actualizar el estado del total
            setTotal(number1 + number2);
        } else {
            // Si las entradas no son números, mostrar un mensaje de error
            setTotal('Por favor, ingrese dos números válidos.');
        }
    };


    return (
        <>
            <h4 className="py-3 mb-4"><span className="text-muted fw-light">Tables /</span> Basic Tables</h4>

            {/* <!-- Basic Bootstrap Table --> */}
            <div className="card">
                <h5 className="card-header">Table Basic</h5>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Moneda</th>
                                <th>Simbolo</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {data.map((item, index) => (
                                <tr>
                                    <td>{item.value}</td>
                                    <td>{item.name}</td>
                                    <td>{item.moneda}</td>
                                    <td>{item.symbol}</td>
                                    <td>
                                        <div className="dropdown">
                                            <button aria-label='Click me' type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <a aria-label="dropdown action option" className="dropdown-item" href="#"
                                                ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                                >
                                                <a aria-label="dropdown action option" className="dropdown-item" href="#"
                                                ><i className="bx bx-trash me-1"></i> Delete</a
                                                >
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Botón para hacer la solicitud POST */}
                <button onClick={handlePostRequest} className="btn btn-primary">
                    Enviar solicitud POST
                </button>

                {/* Mostrar el mensaje de respuesta */}
                {responseMessage && <p>{responseMessage}</p>}
            </div>
            {/* <!--/ Basic Bootstrap Table --> */}



            <div>
                <h2>Suma de dos números</h2>

                <form>
                    <div className="mb-3">
                        <label htmlFor="num1" className="form-label">
                            Número 1
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="num1"
                            value={num1}
                            onChange={(e) => setNum1(e.target.value)} // Actualiza el valor del primer número
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="num2" className="form-label">
                            Número 2
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="num2"
                            value={num2}
                            onChange={(e) => setNum2(e.target.value)} // Actualiza el valor del segundo número
                        />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={handleSum}>
                        Calcular Suma
                    </button>
                </form>

                {total !== null && (
                    <div className="mt-3">
                        <h4>Total: {total}</h4>
                    </div>
                )}
            </div>

        </>
    )
}
