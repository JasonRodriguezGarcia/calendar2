import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';
import PasswordRecoveryComponent from '../components/PasswordRecoveryComponent';

const PasswordRecoveryPage = () =>{
    // const [logeado, setLogeado] = useState(false)
    // const [usuario, setUsuario] = useState({})
    // Aqui la lógica anterior de verificación de usuario no vale, en este caso es que NO ESTE LOGEADO.
    const [logeado, setLogeado] = useState(() => {
        return !!localStorage.getItem("id") // <- o tu propia lógica
            // Si "id" existe en localStorage → logeado = true
            // Si no existe → logeado = false
    })

    const [usuario, setUsuario] = useState(() => {
        return localStorage.getItem("user") || ""
    });


    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <PasswordRecoveryComponent logged={logeado} setLogged={setLogeado} /> {/* user={usuario} setUser={setUsuario} /> */}
        </>
    )
}

export default PasswordRecoveryPage