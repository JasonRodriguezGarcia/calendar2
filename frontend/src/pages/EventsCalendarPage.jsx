import { useState, useEffect } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';

const EventsCalendarPage = () =>{
    const navigate = useNavigate();
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState('')

    useEffect(()=> {
        const checklogeado = () => {
            const nombre_apellidos = localStorage.getItem("user")
            const password = localStorage.getItem("password")
            console.log("Language localstorage: ", nombre_apellidos, password)
            // debugger
            if (nombre_apellidos!== null && password!== null) {
                // lo busca en backend y si todo ok
                setLogeado(true)
                setUsuario({nombre_apellidos: nombre_apellidos, password: password})
            }
            else {
                setLogeado(false)
                navigate(`/`);
            }
        }

        checklogeado()
    }, [])


    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <EventsCalendarComponent logged={logeado} setLogged={setLogeado} user={usuario} />
        </>
    )
}

export default EventsCalendarPage