import MainMenuComponent from '../components/MainMenuComponent';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const MainPage = ({ logged }) => {

    const navigate = useNavigate();
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState('')

    useEffect(()=> {
        const checklogeado = () => {
            const user = localStorage.getItem("user")
            const password = localStorage.getItem("password")
            console.log("Language localstorage: ", user, password)
            // debugger
            if (user!== null && password!== null) {
                // lo busca en backend y si todo ok
                setLogeado(true)
                setUsuario(user)
            }
            else {

                setLogeado(false)
                navigate(`/`);
                // localStorage.setItem("user", "Pepe")
                // localStorage.setItem("password", "paswol")
            }
        }

        checklogeado()
    }, [])

    return (
        <div>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} />
            <h1 style={{paddingTop: "100px"}}>Bienvenido a Erroak Sartu</h1>
            <h3 style={{paddingTop: "100px"}}>Logeado: {logeado ? "Si" : "No"}</h3>
        </div>
    )
}

export default MainPage