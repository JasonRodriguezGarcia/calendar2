import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';
import PasswordRecoveryComponent from '../components/PasswordRecoveryComponent';

const PasswordRecoveryPage = () =>{
    // const navigate = useNavigate();
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})

    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <PasswordRecoveryComponent logged={logeado} setLogged={setLogeado} /> {/* user={usuario} setUser={setUsuario} /> */}
        </>
    )
}

export default PasswordRecoveryPage