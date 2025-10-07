import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate, useNavigate } from 'react-router-dom';
// import SignUpComponent from '../components/SignUpComponent';
import UsersCRUDComponent from '../components/UsersCRUDComponent';
import { Toolbar } from '@mui/material';

const SignUpPage = ({ logged, setLogged, user, setUser }) =>{
    // const [logeado, setLogeado] = useState(false)
    // const [usuario, setUsuario] = useState({})

    if (logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            <UsersCRUDComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} action="create" />
        </>
    )
}

export default SignUpPage