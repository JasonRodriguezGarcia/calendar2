import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import MenuBarComponent from '../components/MenuBarComponent';
import AdminComponent from '../components/AdminComponent';

const AdminPage = () => {
    const { logged, user } = useContext(AppContext)
    // Si no está logeado se sale del componente
    if (!logged || user.role !== "admin")    // con esta opción ni siquiera se muestra brevemente el componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni el otro componente.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MenuBarComponent />
            <AdminComponent />
        </>
  )
}

export default AdminPage;
