import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';
// import SignUpComponent from '../components/SignUpComponent';
import UsersCRUDComponent from '../components/UsersCRUDComponent';
import { Toolbar } from '@mui/material';

const SignUpPage = () =>{
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})

    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            {/* <div style={{ padding: 20 }}> */}
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            {/* <SignUpComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} /> */}
            <UsersCRUDComponent logged={logeado} setLogged={setLogeado} action="create" />
            {/* </div> */}
        </>
    )
}

export default SignUpPage