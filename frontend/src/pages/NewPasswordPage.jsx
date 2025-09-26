import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';
import NewPasswordComponent from '../components/NewPasswordComponent';

const NewPasswordPage = () =>{
    // const navigate = useNavigate();
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})

    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <NewPasswordComponent logged={logeado} setLogged={setLogeado} /> {/* user={usuario} setUser={setUsuario} /> */}
        </>
    )
}

export default NewPasswordPage