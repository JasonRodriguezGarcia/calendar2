import { useState, useEffect } from 'react';
// import HolidaysComponent from '../components/HolidaysComponent';
// import HolidaysViewComponent from '../components/HolidaysViewComponent';
import ContactsComponent from '../components/ContactsComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { useNavigate } from 'react-router-dom';

const ContactsPage = () =>{
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
                navigate(`/`);
            }
        }

        checklogeado()
    }, [])


    return (
        <>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <ContactsComponent logged={logeado} setLogged={setLogeado} user={usuario} />
        </>
    )
}

export default ContactsPage;