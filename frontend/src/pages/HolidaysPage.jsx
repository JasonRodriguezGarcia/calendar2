import { useState, useEffect } from 'react';
import HolidaysComponent from '../components/HolidaysComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate, useNavigate } from 'react-router-dom';

const HolidaysPage = ({ logged, setLogged, user, setUser }) =>{
    // const navigate = useNavigate();
    // const [logeado, setLogeado] = useState(false)
    // const [usuario, setUsuario] = useState({})

    // useEffect(()=> {
    //     const checklogeado = () => {
    //         const usuario_id = parseInt(localStorage.getItem("id"))
    //         const nombre_apellidos = localStorage.getItem("user")
    //         const password = localStorage.getItem("password")
    //         console.log("User localstorage: ", usuario_id, "-", nombre_apellidos, "-", password)
    //         // debugger
    //         if (nombre_apellidos!== null && password!== null) {
    //             // lo busca en backend y si todo ok
    //             setLogeado(true)
    //             setUsuario({id: usuario_id, nombre_apellidos: nombre_apellidos, password: password})
    //         }
    //         else {
    //             setLogeado(false)
    //             navigate(`/`, { replace: true });
    //         }
    //     }

    //     checklogeado()
    // }, [])

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace />

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <HolidaysComponent logged={logged} user={user} />
        </>
    )
}

export default HolidaysPage