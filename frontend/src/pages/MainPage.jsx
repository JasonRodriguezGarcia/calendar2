import MainMenuComponent from '../components/MainMenuComponent';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const MainPage = ({ logged }) => {

    const navigate = useNavigate();
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})

    useEffect(()=> {
        const checklogeado = () => {
            const nombre_apellidos = localStorage.getItem("user")
            const password = localStorage.getItem("password")
            console.log("Language localstorage: ", nombre_apellidos, " - ", password)
            // debugger
            if (nombre_apellidos!== null && password!== null) {
                // lo busca en backend y si todo ok
                setLogeado(true)
                setUsuario({nombre_apellidos: nombre_apellidos, password: password})
            }
            else {
                setLogeado(false)
                navigate(`/`, { replace: true }); // evita que el usuario regrese con back
            }
        }

        checklogeado()
    }, [])

    return (
        <div>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <h1 style={{paddingTop: "100px"}}>Bienvenido a Erroak Sartu</h1>
            <h3 style={{paddingTop: "100px"}}>Logeado: {logeado ? "Si" : "No"}</h3>
        </div>
    )
}

export default MainPage