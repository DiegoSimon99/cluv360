import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"


export const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const userType = localStorage.getItem("user_type");

        // Si hay token, redirigir según el tipo de usuario
        if (token) {
            if (userType === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        }
    }, [navigate]);
    return (
        <h1>Login Customer y Sellers</h1>
    )
}