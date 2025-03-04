import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import './page-misc.css'

export const ErrorPage = () => {
    const [url, setUrl] = useState("/");
    useEffect(() => {
        const user_data = localStorage.getItem("user_data");
        if (user_data) {
            setUrl('login');
        }
    }, []);
    return (
        <>
            <div className="misc-wrapper">
                <h2 className="mb-2 mx-2">Página no encontrada :(</h2>
                <p className="mb-4 mx-2">¡Ups! 😖 La URL solicitada no se encontró en este servidor.</p>
                <Link aria-label='Go to Home Page' to={url} className="btn btn-primary">Back to home</Link>
                <div className="mt-3">
                    <img
                        src="../assets/img/illustrations/page-misc-error-light.png"
                        alt="page-misc-error-light"
                        aria-label="page misc error light"
                        width="500"
                        className="img-fluid"
                        data-app-dark-img="illustrations/page-misc-error-dark.png"
                        data-app-light-img="illustrations/page-misc-error-light.png" />
                </div>
            </div>
        </>
    )
}
