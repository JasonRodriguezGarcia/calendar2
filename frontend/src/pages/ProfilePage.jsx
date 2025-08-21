import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';
import SignUpComponent from '../components/SignUpComponent';
import { Toolbar } from '@mui/material';

const ProfilePage = () =>{
    const navigate = useNavigate();

    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})

    useEffect(()=> {
        const checklogeado = () => {
            const usuario_id = parseInt(localStorage.getItem("id"))
            const nombre_apellidos = localStorage.getItem("user")
            const password = localStorage.getItem("password")
            console.log("User localstorage: ", usuario_id, "-", nombre_apellidos, "-", password)
            // debugger
            if (nombre_apellidos!== null && password!== null) {
                // lo busca en backend y si todo ok
                setLogeado(true)
                setUsuario({id: usuario_id, nombre_apellidos: nombre_apellidos, password: password})
            }
            else {
                setLogeado(false)
                navigate(`/`, { replace: true }); // evita que el usuario regrese con back
            }
        }

        checklogeado()
    }, [])

    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            {/* <div style={{ padding: 20 }}> */}
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            <SignUpComponent logged={logeado} setLogged={setLogeado} user={usuario} action="read" />
            {/* </div> */}
        </>
    )
}

export default ProfilePage