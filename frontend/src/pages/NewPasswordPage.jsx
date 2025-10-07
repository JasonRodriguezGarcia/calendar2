import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import NewPasswordComponent from '../components/NewPasswordComponent';

const NewPasswordPage = ({ logged, setLogged, user, setUser }) =>{
    // const navigate = useNavigate();
    // const [logeado, setLogeado] = useState(false)
    // const [usuario, setUsuario] = useState({})
    // Aqui la lógica anterior de verificación de usuario no vale, en este caso es que NO ESTE LOGEADO.
    // const [logeado, setLogeado] = useState(() => {
    //     return !!localStorage.getItem("id") // <- o tu propia lógica
    //         // Si "id" existe en localStorage → logeado = true
    //         // Si no existe → logeado = false
    // })

    // const [usuario, setUsuario] = useState(() => {
    //     return localStorage.getItem("user") || ""
    // });

    if (logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <NewPasswordComponent logged={logged} setLogged={setLogged} /> {/* user={usuario} setUser={setUsuario} /> */}
        </>
    )
}

export default NewPasswordPage